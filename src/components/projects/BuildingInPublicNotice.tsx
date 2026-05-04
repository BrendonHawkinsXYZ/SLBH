"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FieldMark } from "@/components/FieldMark";
import { DURATIONS, EASE_OUT } from "@/lib/motion";

const STORAGE_KEY = "slbh:projects-notice-seen:v1";
const AUTO_OPEN_DELAY_MS = 1200;

export function BuildingInPublicNotice() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = true;
    }
    if (seen) return;
    const t = window.setTimeout(() => setOpen(true), AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // private mode etc. — ignore
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <div className="container-page bip-strip-wrap">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="bip-strip"
        >
          <span className="bip-strip-left">
            <span className="bip-dot" aria-hidden />
            <span className="t-mono bip-strip-kicker">
              NOTICE · BUILDING IN PUBLIC
            </span>
          </span>
          <span className="bip-strip-msg">
            New project pages are landing here over the coming weeks — preview only.
          </span>
          <span className="t-label bip-strip-cta">OPEN ↗︎</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="bip-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bip-title"
            aria-describedby="bip-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATIONS.fast, ease: EASE_OUT }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              className="bip-dialog"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: DURATIONS.base, ease: EASE_OUT }}
            >
              <div className="bip-row bip-head">
                <span className="t-mono bip-kicker">
                  00 / NOTICE · BUILDING IN PUBLIC
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close notice"
                  className="bip-close link-quiet"
                >
                  <span className="t-label">CLOSE</span>
                  <span className="bip-x" aria-hidden>
                    ×
                  </span>
                </button>
              </div>

              <div className="bip-mark">
                <FieldMark size="md" tone="ground" className="field-pulse" />
              </div>

              <h2 id="bip-title" className="t-h2 bip-title">
                We&rsquo;re building this section in the open.
              </h2>

              <div id="bip-desc">
                <p className="t-body bip-para">
                  Shipping research like engineers ship software is one of our
                  operating ethos &mdash; and that applies to the site itself.
                  You&rsquo;re catching the projects index mid-build.
                </p>
                <p className="t-body bip-para">
                  New project pages are being added here over the coming weeks.
                  If something looks unfinished, it is. The version tag, status
                  marker, and this notice are how we tell on ourselves while we
                  ship.
                </p>
              </div>

              <div className="bip-row bip-foot">
                <span className="bip-status">
                  <span className="bip-status-dot" aria-hidden />
                  <span className="t-label">
                    PROJECTS INDEX · v2.0 · IN PROGRESS
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bip-cta link-quiet"
                >
                  <span className="t-label">WATCH US BUILD ↗︎</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .bip-strip-wrap {
          padding-top: 0;
          padding-bottom: 0;
        }
        .bip-strip {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          padding: 14px 0;
          border-bottom: 0.5px solid var(--hairline);
          background: transparent;
          color: var(--ground);
          text-align: left;
          cursor: pointer;
          font: inherit;
          transition: opacity var(--d-fast) var(--ease-out);
          -webkit-appearance: none;
          appearance: none;
        }
        .bip-strip:hover { opacity: 0.72; }
        .bip-strip:focus-visible {
          outline: 1px solid var(--hairline-strong);
          outline-offset: 4px;
        }
        .bip-strip-left {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .bip-dot {
          width: 8px;
          height: 8px;
          background: var(--affect-violet);
          display: inline-block;
          animation: field-pulse 4.8s var(--ease-in-out) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bip-dot { animation: none; }
        }
        .bip-strip-kicker { opacity: 0.72; }
        .bip-strip-msg {
          flex: 1;
          opacity: 0.72;
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .bip-strip-cta { flex-shrink: 0; }
        @media (max-width: 639px) {
          .bip-strip-msg { display: none; }
        }

        .bip-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(10, 10, 10, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow-y: auto;
        }
        .bip-dialog {
          background: var(--paper);
          color: var(--ground);
          border: 0.5px solid var(--hairline-strong);
          width: 100%;
          max-width: 560px;
          padding: 28px;
          box-sizing: border-box;
          position: relative;
        }
        @media (min-width: 640px) {
          .bip-dialog { padding: 40px; }
        }
        .bip-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .bip-head { margin-bottom: 24px; }
        .bip-kicker { opacity: 0.72; }
        .bip-mark { margin-bottom: 16px; }
        .bip-title {
          margin: 0 0 20px 0;
          letter-spacing: -0.005em;
        }
        .bip-para {
          opacity: 0.82;
          margin: 0 0 14px 0;
          font-size: 16px;
        }
        .bip-para:last-child { margin-bottom: 0; }
        .bip-foot {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 0.5px solid var(--hairline);
          flex-wrap: wrap;
        }
        .bip-close {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          padding: 8px;
          margin: -8px;
          color: var(--ground);
          font: inherit;
          cursor: pointer;
          min-height: 44px;
          min-width: 44px;
          justify-content: flex-end;
        }
        .bip-x {
          font-size: 18px;
          line-height: 1;
        }
        .bip-status {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .bip-status-dot {
          width: 8px;
          height: 8px;
          background: var(--affect-violet);
          display: inline-block;
          animation: field-pulse 4.8s var(--ease-in-out) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bip-status-dot { animation: none; }
        }
        .bip-cta {
          background: transparent;
          border: 1px solid var(--hairline-strong);
          padding: 10px 14px;
          color: var(--ground);
          cursor: pointer;
          font: inherit;
          min-height: 44px;
        }
      `}</style>
    </>
  );
}
