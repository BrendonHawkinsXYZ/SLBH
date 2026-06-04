"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
import { cardFragmentShader, cardVertexShader } from "./shaders";
import {
  type FieldAsset,
  buildPlaceholderPool,
  classifyFile,
  fetchAssetPool,
  sampleUnique,
} from "./assets";

const DESKTOP_CARDS = 100;
const MOBILE_CARDS = 48;
const DESKTOP_MAX_EDGE = 1280;
const MOBILE_MAX_EDGE = 768;
const DESKTOP_VIDEO_BUDGET = 6;
const MOBILE_VIDEO_BUDGET = 1;
const FIELD_RADIUS = 19;
const VERTICAL_SQUASH = 0.8;
const LONG_EDGE = 3.2;
const IDLE_MS = 2500;
const WORKER_URL = process.env.NEXT_PUBLIC_FIELD_NOTES_LIST_URL;

type Card = {
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  tex: THREE.Texture | null;
  video: HTMLVideoElement | null;
  isLiveVideo: boolean;
  token: number;
};

type Loaded = {
  texture: THREE.Texture;
  aspect: number;
  video: HTMLVideoElement | null;
  isLiveVideo: boolean;
};

// Draw a source image or a decoded video frame onto an offscreen canvas with a
// capped long edge, so the texture uploaded to the GPU stays small; oversized
// textures are the cause of the WebGL context loss that crashes phones.
function drawDownscaled(
  source: CanvasImageSource,
  sw: number,
  sh: number,
  maxEdge: number
): HTMLCanvasElement {
  const scale = Math.min(1, maxEdge / Math.max(1, Math.max(sw, sh)));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.drawImage(source, 0, 0, w, h);
  return canvas;
}

function canvasTexture(canvas: HTMLCanvasElement): THREE.Texture {
  const texture = new THREE.Texture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function loadImageTexture(url: string, maxEdge: number): Promise<Loaded> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const sw = img.naturalWidth;
      const sh = img.naturalHeight;
      const canvas = drawDownscaled(img, sw, sh, maxEdge);
      resolve({
        texture: canvasTexture(canvas),
        aspect: sw / Math.max(1, sh),
        video: null,
        isLiveVideo: false,
      });
    };
    img.onerror = () => reject(new Error("image load error"));
    img.src = url;
  });
}

function teardownVideo(video: HTMLVideoElement | null) {
  if (!video) return;
  video.pause();
  video.removeAttribute("src");
  video.load();
}

// Within the live budget a video becomes a live VideoTexture; beyond the budget
// a single frame is captured to a downscaled canvas and the video element is
// released, so a field full of clips cannot exhaust GPU memory.
function loadVideoTexture(url: string, maxEdge: number, wantLive: boolean): Promise<Loaded> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    if (wantLive) video.loop = true;
    const onReady = () => {
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const aspect = vw / Math.max(1, vh);
      if (wantLive) {
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        video.play().catch(() => {});
        resolve({ texture, aspect, video, isLiveVideo: true });
      } else {
        const canvas = drawDownscaled(video, vw, vh, maxEdge);
        const texture = canvasTexture(canvas);
        teardownVideo(video);
        resolve({ texture, aspect, video: null, isLiveVideo: false });
      }
    };
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", () => reject(new Error("video load error")), {
      once: true,
    });
    video.src = url;
    // Muted playback is allowed without a gesture and forces a frame to decode,
    // so the still capture above has something to draw on mobile.
    video.play().catch(() => {});
  });
}

export default function FieldNotesScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<{ reshuffle: () => void } | null>(null);
  const [count, setCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [dropping, setDropping] = useState(false);
  const [localActive, setLocalActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onReshuffle = useCallback(() => apiRef.current?.reshuffle(), []);

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    const maxCards = isMobile ? MOBILE_CARDS : DESKTOP_CARDS;
    const maxEdge = isMobile ? MOBILE_MAX_EDGE : DESKTOP_MAX_EDGE;
    const videoBudget = isMobile ? MOBILE_VIDEO_BUDGET : DESKTOP_VIDEO_BUDGET;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      setError("WEBGL UNAVAILABLE");
      return;
    }

    let disposed = false;
    let contextLost = false;
    let liveVideoCount = 0;
    const objectUrls: string[] = [];
    const poolRef: { current: FieldAsset[] } = { current: [] };
    const cards: Card[] = [];
    const tmp = new THREE.Vector3();

    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x0b0b0f, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / Math.max(1, height), 0.1, 220);
    camera.position.set(0, 0, reducedMotion ? 40 : 82);

    const field = new THREE.Group();
    scene.add(field);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.35;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.6;
    controls.minDistance = 6;
    controls.maxDistance = 200;
    controls.enabled = false;

    const blankTex = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1, THREE.RGBAFormat);
    blankTex.needsUpdate = true;

    const geometry = new THREE.PlaneGeometry(1, 1);

    let lastInteraction = performance.now();
    let pointerActive = false;

    function randomFieldPosition(target: THREE.Vector3) {
      const r = FIELD_RADIUS * Math.cbrt(Math.random());
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      const sinT = Math.sin(theta);
      target.set(
        r * sinT * Math.cos(phi),
        r * Math.cos(theta) * VERTICAL_SQUASH,
        r * sinT * Math.sin(phi)
      );
    }

    function makeMaterial() {
      return new THREE.ShaderMaterial({
        uniforms: {
          uTex: { value: blankTex },
          uTime: { value: 0 },
          uWidth: { value: LONG_EDGE },
          uHeight: { value: LONG_EDGE },
          uBobAmp: { value: reducedMotion ? 0 : 0.16 + Math.random() * 0.12 },
          uBobSpeed: { value: 0.45 + Math.random() * 0.5 },
          uBobPhase: { value: Math.random() * Math.PI * 2 },
          uReveal: { value: 0 },
        },
        vertexShader: cardVertexShader,
        fragmentShader: cardFragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        side: THREE.DoubleSide,
      });
    }

    function applyTexture(card: Card, loaded: Loaded) {
      if (card.tex && card.tex !== loaded.texture) card.tex.dispose();
      if (card.video && card.video !== loaded.video) teardownVideo(card.video);
      if (card.isLiveVideo && card.video !== loaded.video) {
        liveVideoCount = Math.max(0, liveVideoCount - 1);
      }
      card.tex = loaded.texture;
      card.video = loaded.video;
      card.isLiveVideo = loaded.isLiveVideo;
      card.mat.uniforms.uTex.value = loaded.texture;
      // Long edge fixed, short edge follows the asset aspect, so the quad keeps
      // the image proportions and nothing is stretched.
      card.mat.uniforms.uWidth.value = loaded.aspect >= 1 ? LONG_EDGE : LONG_EDGE * loaded.aspect;
      card.mat.uniforms.uHeight.value = loaded.aspect >= 1 ? LONG_EDGE / loaded.aspect : LONG_EDGE;
    }

    async function populateCard(card: Card, asset: FieldAsset, fadeOutFirst: boolean, delay: number) {
      const token = ++card.token;
      if (fadeOutFirst && card.tex) {
        await new Promise<void>((resolve) => {
          gsap.to(card.mat.uniforms.uReveal, { value: 0, duration: 0.3, ease: "power1.in", onComplete: resolve });
        });
        if (token !== card.token || disposed) return;
      }
      // Reserve a live video slot synchronously, before any await, so concurrent
      // loads cannot overshoot the budget.
      let reserved = false;
      if (asset.type === "video" && liveVideoCount < videoBudget) {
        liveVideoCount++;
        reserved = true;
      }
      let loaded: Loaded | null = null;
      try {
        loaded =
          asset.type === "video"
            ? await loadVideoTexture(asset.url, maxEdge, reserved)
            : await loadImageTexture(asset.url, maxEdge);
      } catch {
        loaded = null;
      }
      if (!loaded || token !== card.token || disposed) {
        if (reserved) liveVideoCount = Math.max(0, liveVideoCount - 1);
        if (loaded) {
          loaded.texture.dispose();
          teardownVideo(loaded.video);
        }
        return;
      }
      if (reserved && !loaded.isLiveVideo) liveVideoCount = Math.max(0, liveVideoCount - 1);
      applyTexture(card, loaded);
      gsap.to(card.mat.uniforms.uReveal, { value: 1, duration: 0.9, delay, ease: "power2.out" });
    }

    function disposeCards() {
      for (const c of cards) {
        gsap.killTweensOf(c.mesh.position);
        gsap.killTweensOf(c.mat.uniforms.uReveal);
        field.remove(c.mesh);
        c.mat.dispose();
        c.tex?.dispose();
        teardownVideo(c.video);
      }
      cards.length = 0;
      liveVideoCount = 0;
    }

    // Build one card per sampled asset, capped at maxCards and sampled uniquely,
    // so the field holds only what is in the bucket with no duplicates.
    function buildAndPopulate(pool: FieldAsset[]) {
      disposeCards();
      const sample = sampleUnique(pool, maxCards);
      setCount(sample.length);
      const base = reducedMotion ? 0 : 0.4;
      for (let i = 0; i < sample.length; i++) {
        const mat = makeMaterial();
        const mesh = new THREE.Mesh(geometry, mat);
        randomFieldPosition(tmp);
        mesh.position.copy(tmp);
        mesh.frustumCulled = false;
        field.add(mesh);
        const card: Card = { mesh, mat, tex: null, video: null, isLiveVideo: false, token: 0 };
        cards.push(card);
        populateCard(card, sample[i], false, base + i * 0.014);
      }
    }

    function reshuffle() {
      if (!cards.length) return;
      controls.autoRotate = false;
      lastInteraction = performance.now();
      for (const c of cards) {
        randomFieldPosition(tmp);
        gsap.to(c.mesh.position, { x: tmp.x, y: tmp.y, z: tmp.z, duration: 1.4, ease: "power2.inOut" });
      }
      // Reset the live video accounting; old elements are torn down on apply.
      liveVideoCount = 0;
      for (const c of cards) c.isLiveVideo = false;
      const sample = sampleUnique(poolRef.current, cards.length);
      sample.forEach((asset, i) => populateCard(cards[i], asset, true, Math.random() * 0.3));
    }
    apiRef.current = { reshuffle };

    function setLocalPool(files: FileList) {
      const assets: FieldAsset[] = [];
      for (const f of Array.from(files)) {
        const type = f.type.startsWith("image/")
          ? "image"
          : f.type.startsWith("video/")
            ? "video"
            : classifyFile(f.name);
        if (!type) continue;
        const url = URL.createObjectURL(f);
        objectUrls.push(url);
        assets.push({ url, type });
      }
      if (!assets.length) return;
      poolRef.current = assets;
      setLocalActive(true);
      buildAndPopulate(assets);
    }

    // Animation loop
    const clock = new THREE.Clock();
    let raf = 0;
    let frames = 0;
    let fpsAt = performance.now();
    function tick() {
      raf = requestAnimationFrame(tick);
      if (contextLost) return;
      const t = clock.getElapsedTime();
      for (const c of cards) {
        c.mat.uniforms.uTime.value = t;
        if (c.isLiveVideo && c.tex && c.video && c.video.readyState >= 2) {
          c.tex.needsUpdate = true;
        }
      }
      if (!reducedMotion && !pointerActive && performance.now() - lastInteraction > IDLE_MS) {
        controls.autoRotate = true;
      }
      controls.update();
      renderer.render(scene, camera);
      frames++;
      const now = performance.now();
      if (now - fpsAt >= 500) {
        const value = Math.round((frames * 1000) / (now - fpsAt));
        frames = 0;
        fpsAt = now;
        setFps(value);
      }
    }

    const onControlStart = () => {
      pointerActive = true;
      controls.autoRotate = false;
    };
    const onControlEnd = () => {
      pointerActive = false;
      lastInteraction = performance.now();
    };
    const onWheel = () => {
      controls.autoRotate = false;
      lastInteraction = performance.now();
    };
    controls.addEventListener("start", onControlStart);
    controls.addEventListener("end", onControlEnd);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true });

    // Recover from a lost context instead of letting the tab crash and reload.
    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
    };
    const onContextRestored = () => {
      contextLost = false;
      buildAndPopulate(poolRef.current);
      cancelAnimationFrame(raf);
      tick();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost, false);
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored, false);

    // Local drag and drop, session only
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      setDropping(true);
    };
    const onDragLeave = (e: DragEvent) => {
      if (e.target === container) setDropping(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setDropping(false);
      if (e.dataTransfer?.files?.length) setLocalPool(e.dataTransfer.files);
    };
    container.addEventListener("dragover", onDragOver);
    container.addEventListener("dragleave", onDragLeave);
    container.addEventListener("drop", onDrop);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize);

    // Start the entry dolly straight away, then load the pool and build the
    // field as it arrives.
    tick();
    if (reducedMotion) {
      controls.maxDistance = 72;
      controls.enabled = true;
      lastInteraction = performance.now();
    } else {
      gsap.to(camera.position, {
        z: 40,
        duration: 2.2,
        ease: "power2.out",
        onComplete: () => {
          controls.maxDistance = 72;
          controls.enabled = true;
          lastInteraction = performance.now();
        },
      });
    }

    const controller = new AbortController();
    (async () => {
      const remote = await fetchAssetPool(WORKER_URL, controller.signal);
      if (disposed) return;
      poolRef.current = remote.length > 0 ? remote : buildPlaceholderPool();
      buildAndPopulate(poolRef.current);
    })();

    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(raf);
      gsap.killTweensOf(camera.position);
      controls.removeEventListener("start", onControlStart);
      controls.removeEventListener("end", onControlEnd);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
      container.removeEventListener("dragover", onDragOver);
      container.removeEventListener("dragleave", onDragLeave);
      container.removeEventListener("drop", onDrop);
      window.removeEventListener("resize", onResize);
      disposeCards();
      geometry.dispose();
      blankTex.dispose();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  return (
    <div ref={containerRef} className="fn-root">
      <div ref={mountRef} className="fn-canvas" />
      <div className="fn-grain" aria-hidden />
      <div className="fn-vignette" aria-hidden />

      <span className="fn-bracket fn-bracket--tl" aria-hidden />
      <span className="fn-bracket fn-bracket--tr" aria-hidden />
      <span className="fn-bracket fn-bracket--bl" aria-hidden />
      <span className="fn-bracket fn-bracket--br" aria-hidden />

      <div className="fn-mark t-mono">09 / FIELD NOTES</div>

      <div className="fn-controls">
        <button type="button" className="fn-btn t-mono" onClick={onReshuffle}>
          RESHUFFLE
        </button>
      </div>

      <div className="fn-monitor t-mono" aria-live="polite">
        <span>FIELD MONITOR</span>
        <span>CARDS: {String(count).padStart(3, "0")}</span>
        <span>FPS: {String(fps).padStart(3, "0")}</span>
      </div>

      {localActive && (
        <div className="fn-note t-mono">LOCAL SESSION · PREVIEW ONLY · NOT SAVED TO R2</div>
      )}

      {dropping && (
        <div className="fn-drop">
          <span className="t-mono">RELEASE TO PREVIEW · SESSION ONLY</span>
        </div>
      )}

      {error && (
        <div className="fn-error t-mono">
          {error}, this view needs a WebGL capable browser.
        </div>
      )}

      <style>{`
        .fn-root {
          position: relative;
          width: 100%;
          height: calc(100svh - 104px);
          min-height: 460px;
          background: #0B0B0F;
          overflow: hidden;
          color: #F2F2F2;
        }
        @media (min-width: 768px) {
          .fn-root { height: calc(100svh - 112px); }
        }
        .fn-canvas { position: absolute; inset: 0; }
        .fn-canvas canvas { touch-action: none; }

        .fn-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.05;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px 160px;
        }
        .fn-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%);
        }

        .fn-bracket {
          position: absolute;
          width: 24px;
          height: 24px;
          pointer-events: none;
          border-color: rgba(242, 242, 242, 0.3);
          border-style: solid;
          border-width: 0;
        }
        .fn-bracket--tl { top: 20px; left: 20px; border-top-width: 1px; border-left-width: 1px; }
        .fn-bracket--tr { top: 20px; right: 20px; border-top-width: 1px; border-right-width: 1px; }
        .fn-bracket--bl { bottom: 20px; left: 20px; border-bottom-width: 1px; border-left-width: 1px; }
        .fn-bracket--br { bottom: 20px; right: 20px; border-bottom-width: 1px; border-right-width: 1px; }

        .fn-mark {
          position: absolute;
          top: 26px;
          left: 40px;
          font-size: 10px;
          letter-spacing: 0.18em;
          opacity: 0.62;
        }

        .fn-controls {
          position: absolute;
          bottom: 24px;
          right: 40px;
          display: flex;
          gap: 10px;
        }
        .fn-btn {
          background: rgba(242, 242, 242, 0.04);
          border: 1px solid rgba(242, 242, 242, 0.18);
          color: #F2F2F2;
          font-size: 10px;
          letter-spacing: 0.14em;
          padding: 7px 12px;
          cursor: pointer;
          transition: border-color 300ms ease, background 300ms ease;
        }
        .fn-btn:hover { border-color: rgba(75, 92, 255, 0.7); background: rgba(75, 92, 255, 0.08); }

        .fn-monitor {
          position: absolute;
          bottom: 64px;
          right: 40px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 12px 14px;
          border: 1px solid rgba(242, 242, 242, 0.14);
          background: rgba(11, 11, 15, 0.55);
          font-size: 9.5px;
          letter-spacing: 0.12em;
          opacity: 0.82;
        }

        .fn-note {
          position: absolute;
          bottom: 26px;
          left: 40px;
          font-size: 9.5px;
          letter-spacing: 0.12em;
          opacity: 0.6;
        }

        .fn-drop {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          background: rgba(11, 11, 15, 0.4);
          border: 1px dashed rgba(75, 92, 255, 0.5);
        }
        .fn-drop span { font-size: 11px; letter-spacing: 0.2em; opacity: 0.9; }

        .fn-error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 11px;
          letter-spacing: 0.1em;
          opacity: 0.7;
          text-align: center;
          max-width: 80vw;
        }

        @media (max-width: 640px) {
          .fn-mark { left: 24px; }
          .fn-controls { right: 24px; }
          .fn-monitor { right: 24px; }
          .fn-note { left: 24px; }
        }
      `}</style>
    </div>
  );
}
