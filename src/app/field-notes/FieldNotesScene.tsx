"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
import { cardFragmentShader, cardVertexShader } from "./shaders";
import {
  type FieldAsset,
  buildPlaceholderPool,
  classifyFile,
  fetchAssetPool,
  sampleToCount,
} from "./assets";

const CARD_COUNT = 100;
const FIELD_RADIUS = 19;
const VERTICAL_SQUASH = 0.8;
const LONG_EDGE = 3.2;
const FEATHER = 0.07;
const IDLE_MS = 2500;
const WORKER_URL = process.env.NEXT_PUBLIC_FIELD_NOTES_LIST_URL;

type SourceLabel = "LOADING" | "R2 BUCKET" | "PLACEHOLDER FALLBACK" | "LOCAL SESSION";

type Card = {
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  tex: THREE.Texture | null;
  video: HTMLVideoElement | null;
  token: number;
};

type Loaded = { texture: THREE.Texture; aspect: number; video: HTMLVideoElement | null };

function loadImageTexture(url: string): Promise<Loaded> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const texture = new THREE.Texture(img);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
      const aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
      resolve({ texture, aspect, video: null });
    };
    img.onerror = () => reject(new Error("image load error"));
    img.src = url;
  });
}

function loadVideoTexture(url: string): Promise<Loaded> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";
    video.src = url;
    video.addEventListener(
      "loadedmetadata",
      () => {
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        const aspect = video.videoWidth / Math.max(1, video.videoHeight);
        video.play().catch(() => {});
        resolve({ texture, aspect, video });
      },
      { once: true }
    );
    video.addEventListener("error", () => reject(new Error("video load error")), {
      once: true,
    });
  });
}

export default function FieldNotesScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<{ reshuffle: () => void } | null>(null);
  const monitorOnRef = useRef(false);

  const [source, setSource] = useState<SourceLabel>("LOADING");
  const [count, setCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [monitor, setMonitor] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [localActive, setLocalActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onReshuffle = useCallback(() => apiRef.current?.reshuffle(), []);
  const onToggleMonitor = useCallback(() => {
    setMonitor((v) => {
      monitorOnRef.current = !v;
      return !v;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      setError("WEBGL UNAVAILABLE");
      return;
    }

    let disposed = false;
    const objectUrls: string[] = [];
    const poolRef: { current: FieldAsset[] } = { current: [] };
    const cards: Card[] = [];
    const tmp = new THREE.Vector3();

    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x0b0b0f, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
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
    // Loosened so the far entry dolly is not clamped; constrained once the
    // camera has settled, in the reduced motion branch and the dolly onComplete.
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

    function applyTexture(card: Card, texture: THREE.Texture, aspect: number, video: HTMLVideoElement | null) {
      if (card.tex && card.tex !== texture) card.tex.dispose();
      if (card.video && card.video !== video) {
        card.video.pause();
        card.video.removeAttribute("src");
        card.video.load();
      }
      card.tex = texture;
      card.video = video;
      card.mat.uniforms.uTex.value = texture;
      card.mat.uniforms.uWidth.value = aspect >= 1 ? LONG_EDGE : LONG_EDGE * aspect;
      card.mat.uniforms.uHeight.value = aspect >= 1 ? LONG_EDGE / aspect : LONG_EDGE;
    }

    async function populateCard(card: Card, asset: FieldAsset, fadeOutFirst: boolean, delay: number) {
      const token = ++card.token;
      if (fadeOutFirst && card.tex) {
        await new Promise<void>((resolve) => {
          gsap.to(card.mat.uniforms.uReveal, { value: 0, duration: 0.3, ease: "power1.in", onComplete: resolve });
        });
        if (token !== card.token || disposed) return;
      }
      let loaded: Loaded | null = null;
      try {
        loaded = asset.type === "video" ? await loadVideoTexture(asset.url) : await loadImageTexture(asset.url);
      } catch {
        loaded = null;
      }
      if (!loaded || token !== card.token || disposed) {
        if (loaded) {
          loaded.texture.dispose();
          loaded.video?.pause();
        }
        return;
      }
      applyTexture(card, loaded.texture, loaded.aspect, loaded.video);
      gsap.to(card.mat.uniforms.uReveal, { value: 1, duration: 0.9, delay, ease: "power2.out" });
    }

    function buildField() {
      for (let i = 0; i < CARD_COUNT; i++) {
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTex: { value: blankTex },
            uTime: { value: 0 },
            uWidth: { value: LONG_EDGE },
            uHeight: { value: LONG_EDGE },
            uBobAmp: { value: reducedMotion ? 0 : 0.16 + Math.random() * 0.12 },
            uBobSpeed: { value: 0.45 + Math.random() * 0.5 },
            uBobPhase: { value: Math.random() * Math.PI * 2 },
            uReveal: { value: 0 },
            uFeather: { value: FEATHER },
          },
          vertexShader: cardVertexShader,
          fragmentShader: cardFragmentShader,
          transparent: true,
          depthWrite: false,
          depthTest: true,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, mat);
        randomFieldPosition(tmp);
        mesh.position.copy(tmp);
        mesh.frustumCulled = false;
        field.add(mesh);
        cards.push({ mesh, mat, tex: null, video: null, token: 0 });
      }
    }

    function populateAll(pool: FieldAsset[], fadeOutFirst: boolean) {
      const sample = sampleToCount(pool, CARD_COUNT);
      if (sample.length === 0) return;
      const base = reducedMotion ? 0 : 0.5;
      sample.forEach((asset, i) => {
        populateCard(card_at(i), asset, fadeOutFirst, base + (fadeOutFirst ? Math.random() * 0.3 : i * 0.012));
      });
    }

    function card_at(i: number) {
      return cards[i % cards.length];
    }

    function reshuffle() {
      if (!cards.length) return;
      controls.autoRotate = false;
      lastInteraction = performance.now();
      for (const c of cards) {
        randomFieldPosition(tmp);
        gsap.to(c.mesh.position, { x: tmp.x, y: tmp.y, z: tmp.z, duration: 1.4, ease: "power2.inOut" });
      }
      populateAll(poolRef.current, true);
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
      setSource("LOCAL SESSION");
      setLocalActive(true);
      populateAll(assets, true);
    }

    // Animation loop
    const clock = new THREE.Clock();
    let raf = 0;
    let frames = 0;
    let fpsAt = performance.now();
    function tick() {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      for (const c of cards) c.mat.uniforms.uTime.value = t;
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
        if (monitorOnRef.current) setFps(value);
      }
    }

    // Interaction listeners that pause the idle drift
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

    // Build the field and start the entry dolly straight away, so the
    // animation never waits on the network, then load the pool and reveal the
    // cards as their textures arrive.
    buildField();
    setCount(CARD_COUNT);
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
      const usingRemote = remote.length > 0;
      poolRef.current = usingRemote ? remote : buildPlaceholderPool();
      setSource(usingRemote ? "R2 BUCKET" : "PLACEHOLDER FALLBACK");
      populateAll(poolRef.current, false);
    })();

    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(raf);
      gsap.killTweensOf(camera.position);
      controls.removeEventListener("start", onControlStart);
      controls.removeEventListener("end", onControlEnd);
      renderer.domElement.removeEventListener("wheel", onWheel);
      container.removeEventListener("dragover", onDragOver);
      container.removeEventListener("dragleave", onDragLeave);
      container.removeEventListener("drop", onDrop);
      window.removeEventListener("resize", onResize);
      for (const c of cards) {
        gsap.killTweensOf(c.mesh.position);
        gsap.killTweensOf(c.mat.uniforms.uReveal);
        c.mat.dispose();
        c.tex?.dispose();
        if (c.video) {
          c.video.pause();
          c.video.removeAttribute("src");
          c.video.load();
        }
      }
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
        <button
          type="button"
          className="fn-btn t-mono"
          onClick={onToggleMonitor}
          aria-pressed={monitor}
        >
          MONITOR {monitor ? "ON" : "OFF"}
        </button>
      </div>

      {monitor && (
        <div className="fn-monitor t-mono" aria-live="polite">
          <span>FIELD MONITOR</span>
          <span>SOURCE: {source}</span>
          <span>CARDS: {String(count).padStart(3, "0")}</span>
          <span>FPS: {String(fps).padStart(3, "0")}</span>
        </div>
      )}

      <div className="fn-foot">
        <Link href="/" className="fn-wordmark link-quiet">
          STUDIO LAB BH
        </Link>
        <span className="fn-tag t-mono">SLBH</span>
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
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: #0B0B0F;
          overflow: hidden;
          color: #F2F2F2;
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
          width: 26px;
          height: 26px;
          pointer-events: none;
          border-color: rgba(242, 242, 242, 0.32);
          border-style: solid;
          border-width: 0;
        }
        .fn-bracket--tl { top: 22px; left: 22px; border-top-width: 1px; border-left-width: 1px; }
        .fn-bracket--tr { top: 22px; right: 22px; border-top-width: 1px; border-right-width: 1px; }
        .fn-bracket--bl { bottom: 22px; left: 22px; border-bottom-width: 1px; border-left-width: 1px; }
        .fn-bracket--br { bottom: 22px; right: 22px; border-bottom-width: 1px; border-right-width: 1px; }

        .fn-mark {
          position: absolute;
          top: 34px;
          left: 46px;
          font-size: 10px;
          letter-spacing: 0.18em;
          opacity: 0.62;
        }

        .fn-controls {
          position: absolute;
          top: 30px;
          right: 46px;
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
          transition: border-color 300ms ease, background 300ms ease, opacity 300ms ease;
        }
        .fn-btn:hover { border-color: rgba(75, 92, 255, 0.7); background: rgba(75, 92, 255, 0.08); }

        .fn-monitor {
          position: absolute;
          top: 70px;
          right: 46px;
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

        .fn-foot {
          position: absolute;
          bottom: 30px;
          left: 46px;
          display: flex;
          align-items: baseline;
          gap: 14px;
        }
        .fn-wordmark {
          font-family: var(--font-orbitron), sans-serif;
          font-weight: 500;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #F2F2F2;
          text-decoration: none;
        }
        .fn-tag {
          font-size: 9.5px;
          letter-spacing: 0.18em;
          opacity: 0.5;
        }

        .fn-note {
          position: absolute;
          bottom: 32px;
          right: 46px;
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
          .fn-mark { left: 24px; top: 30px; }
          .fn-controls { right: 24px; top: 26px; }
          .fn-monitor { right: 24px; }
          .fn-foot { left: 24px; bottom: 24px; }
          .fn-note { right: 24px; bottom: 26px; }
        }
      `}</style>
    </div>
  );
}
