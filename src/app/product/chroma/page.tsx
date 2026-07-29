import Link from "next/link";
import { findAsset } from "@/lib/assets";
import { FallbackImg } from "@/components/projects/FallbackImg";

// Advertisement register — an app listing in SLBH's visual language rather than
// a system readout. Copy marked chr-tk is a placeholder; screens fill in on
// their own as files land in public/product/chroma/.

export const metadata = {
  title: "Chroma — SLBH",
  description: "Chroma, the app from Studio Lab BH. Launching September 2026.",
};

const LAUNCH = "SEPTEMBER 2026";
const CONTACT =
  "mailto:Brendon@studiolabbh.xyz?subject=Chroma%20%E2%80%94%20launch%20note";

const SPECS: { label: string; value: string }[] = [
  { label: "DEVELOPER", value: "STUDIO LAB BH" },
  { label: "CATEGORY", value: "TK" },
  { label: "PLATFORM", value: "TK" },
  { label: "PRICE", value: "TK" },
  { label: "LAUNCH", value: LAUNCH },
];

const FEATURES: { index: string; headline: string; line: string }[] = [
  {
    index: "01",
    headline: "TK — feature one.",
    line: "TK — one line on what it does for the person using it.",
  },
  {
    index: "02",
    headline: "TK — feature two.",
    line: "TK — one line. Keep it concrete and short.",
  },
  {
    index: "03",
    headline: "TK — feature three.",
    line: "TK — one line. Something the app does that nothing else does.",
  },
  {
    index: "04",
    headline: "TK — feature four.",
    line: "TK — one line to close the set.",
  },
];

const AT_LAUNCH = [
  "TK — WHAT SHIPS IN VERSION ONE",
  "TK — WHAT SHIPS IN VERSION ONE",
  "TK — WHAT SHIPS IN VERSION ONE",
  "TK — WHAT SHIPS IN VERSION ONE",
];

export default function ChromaProductPage() {
  const asset = (base: string) => findAsset("product/chroma", base);
  const iconSrc = asset("icon");
  const screens = ["screen-01", "screen-02", "screen-03", "screen-04", "screen-05"];

  return (
    <>
      {/* ── Section 1: Listing header ── */}
      <section className="container-page chr-hero">
        <div className="chr-hero-grid">
          <div className="chr-hero-icon-wrap">
            <div className="chr-hero-icon">
              <div className="chr-icon-bg" />
              {iconSrc && (
                <FallbackImg src={iconSrc} alt="Chroma app icon" className="chr-img-fill" />
              )}
              {!iconSrc && (
                <span className="t-mono chr-icon-tk" aria-hidden>
                  TK: ICON
                </span>
              )}
            </div>
          </div>
          <div className="chr-hero-text">
            <p className="t-mono chr-kicker">STUDIO LAB BH · APP</p>
            <h1 className="t-display chr-title">Chroma</h1>
            <p className="chr-tagline chr-tk">
              TK — the tagline. One line that says what Chroma gives you.
            </p>
            <div className="chr-hero-actions">
              <a href={CONTACT} className="t-nav link-quiet chr-cta">
                Get the launch note
              </a>
              <span className="t-mono chr-hero-note">LAUNCHING {LAUNCH}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Listing spec strip ── */}
      <div className="hairline-t hairline-b chr-specs-wrap">
        <div className="chr-specs">
          {SPECS.map((spec) => (
            <div key={spec.label} className="chr-spec">
              <span className="t-mono chr-spec-key">{spec.label}</span>
              <span className="t-mono chr-spec-val">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Preview ── */}
      <section className="container-page chr-preview">
        <p className="t-mono chr-section-label">PREVIEW</p>
        <div className="chr-screen-row">
          {screens.map((base) => {
            const src = asset(base);
            return (
              <div key={base} className="chr-screen-frame">
                <div className="chr-icon-bg" />
                {src && (
                  <FallbackImg src={src} alt="Chroma app screen" className="chr-img-fill" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 4: Pitch ── */}
      <section className="container-page chr-pitch">
        <h2 className="t-h1 chr-pitch-head chr-tk">
          TK — the headline claim. What Chroma is, in one sentence a stranger
          understands.
        </h2>
        <div className="chr-pitch-body">
          <p className="t-body chr-body chr-tk">
            TK — the paragraph a person reads before deciding to download. What
            they open the app to do, and what they walk away with.
          </p>
          <p className="t-body chr-body chr-tk">
            TK — the second paragraph. Why it comes from this lab, said without
            explaining the pipeline.
          </p>
        </div>
      </section>

      {/* ── Section 5: Features ── */}
      <section className="container-page chr-features">
        <p className="t-mono chr-section-label">WHAT IT DOES</p>
        <div className="chr-feature-grid">
          {FEATURES.map((feature) => (
            <article key={feature.index} className="chr-feature">
              <p className="t-mono chr-feature-idx">{feature.index}</p>
              <h3 className="t-h3 chr-feature-head chr-tk">{feature.headline}</h3>
              <p className="t-body-sm chr-feature-line chr-tk">{feature.line}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Section 6: At launch ── */}
      <section className="container-page chr-launch">
        <p className="t-mono chr-section-label">AT LAUNCH</p>
        <ul className="chr-launch-list">
          {AT_LAUNCH.map((item, i) => (
            <li key={i} className="chr-tk">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Section 7: Closing band ── */}
      <section className="chr-band">
        <div className="container-page chr-band-inner">
          <h2 className="t-h1 chr-band-head">Chroma arrives in September.</h2>
          <p className="chr-band-line chr-tk">
            TK — one closing line. What signing up gets someone between now and
            launch day.
          </p>
          <a href={CONTACT} className="t-nav link-quiet chr-cta chr-cta--invert">
            Get the launch note
          </a>
        </div>
      </section>

      {/* ── Section 8: Links ── */}
      <section className="container-page chr-links">
        {[
          { label: "AMERICAN EMOTIONS", href: "/projects/american-emotions", note: "/projects/american-emotions" },
          { label: "AFFECTIVE GEOMETRY", href: "/projects/affective-geometry", note: "/projects/affective-geometry" },
          { label: "READ THE THEORY", href: "/research/emotion-as-system", note: "/research/emotion-as-system" },
        ].map(({ label, href, note }, i) => (
          <div
            key={label}
            className="chr-link-row"
            style={{ borderTop: i === 0 ? "0.5px solid var(--hairline)" : undefined }}
          >
            <span className="chr-link-label">{label}</span>
            <Link href={href} className="t-mono link-quiet chr-link-url">
              {note} →
            </Link>
          </div>
        ))}
      </section>

      <style>{`
        /* ── Placeholder register ── */
        .chr-tk { opacity: 0.45; }

        /* ── Listing header ── */
        .chr-hero { padding-top: 56px; padding-bottom: 56px; }
        .chr-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: center;
        }
        @media (min-width: 768px) {
          .chr-hero-grid {
            grid-template-columns: 180px 1fr;
            gap: 48px;
          }
        }
        .chr-hero-icon {
          position: relative;
          width: 132px;
          height: 132px;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .chr-hero-icon { width: 180px; height: 180px; }
        }
        .chr-icon-bg { position: absolute; inset: 0; background: var(--graphite); }
        .chr-icon-tk {
          position: relative;
          z-index: 1;
          color: var(--signal);
          opacity: 0.35;
          font-size: 9px;
          letter-spacing: 0.14em;
        }
        .chr-img-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .chr-kicker { opacity: 0.55; margin: 0 0 16px; }
        .chr-title { margin: 0 0 20px; }
        .chr-tagline {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 22px;
          line-height: 1.4;
          max-width: 560px;
          margin: 0 0 32px;
        }
        .chr-hero-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .chr-cta {
          display: inline-block;
          color: var(--ground);
          text-decoration: none;
          border: 1px solid var(--ground);
          padding: 14px 32px;
        }
        .chr-cta--invert {
          color: var(--signal);
          border-color: var(--signal);
        }
        .chr-hero-note { opacity: 0.45; }

        /* ── Spec strip ── */
        .chr-specs-wrap { width: 100%; }
        .chr-specs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          max-width: var(--max-w);
          margin-inline: auto;
          width: 100%;
          box-sizing: border-box;
          padding: 0 var(--pad-x-mobile);
        }
        @media (min-width: 768px) {
          .chr-specs {
            grid-template-columns: repeat(5, 1fr);
            padding: 0 var(--pad-x);
          }
        }
        .chr-spec {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 20px 0;
          border-right: 0.5px solid var(--hairline);
        }
        .chr-spec:last-child { border-right: none; }
        @media (max-width: 767px) {
          .chr-spec { padding: 16px 0; }
          .chr-spec:nth-child(2n) { border-right: none; padding-left: 16px; }
          .chr-spec:nth-child(2n+1) { padding-right: 16px; }
        }
        .chr-spec-key { font-size: 9px; letter-spacing: 0.14em; opacity: 0.45; }
        .chr-spec-val { font-size: 11px; letter-spacing: 0.08em; opacity: 0.82; }

        /* ── Section labels ── */
        .chr-section-label {
          opacity: 0.45;
          margin: 0 0 24px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }

        /* ── Preview ── */
        .chr-preview { padding-top: 72px; padding-bottom: 96px; }
        .chr-screen-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        @media (min-width: 768px) {
          .chr-screen-row { gap: 28px; }
        }
        .chr-screen-frame {
          position: relative;
          flex-shrink: 0;
          width: 232px;
          aspect-ratio: 9/19.5;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .chr-screen-frame { width: 264px; }
        }

        /* ── Pitch ── */
        .chr-pitch { padding-top: 0; padding-bottom: 96px; }
        .chr-pitch-head {
          margin: 0 0 40px;
          max-width: 860px;
        }
        .chr-pitch-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 860px;
        }
        @media (min-width: 768px) {
          .chr-pitch-body { grid-template-columns: 1fr 1fr; gap: 48px; }
        }
        .chr-body { margin: 0; line-height: 1.7; }

        /* ── Features ── */
        .chr-features { padding-top: 0; padding-bottom: 96px; }
        .chr-feature-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 600px) {
          .chr-feature-grid { grid-template-columns: repeat(2, 1fr); gap: 48px; }
        }
        @media (min-width: 1000px) {
          .chr-feature-grid { grid-template-columns: repeat(4, 1fr); gap: 32px; }
        }
        .chr-feature {
          border-top: 0.5px solid var(--hairline-strong);
          padding-top: 20px;
        }
        .chr-feature-idx {
          margin: 0 0 20px;
          font-size: 10px;
          letter-spacing: 0.14em;
          opacity: 0.45;
        }
        .chr-feature-head { margin: 0 0 14px; }
        .chr-feature-line { margin: 0; line-height: 1.6; }

        /* ── At launch ── */
        .chr-launch { padding-top: 0; padding-bottom: 96px; }
        .chr-launch-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-width: 720px;
          font-family: var(--font-plex-mono), ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
        }
        .chr-launch-list li {
          padding: 14px 0;
          border-top: 0.5px solid var(--hairline);
        }
        .chr-launch-list li:last-child { border-bottom: 0.5px solid var(--hairline); }

        /* ── Closing band ── */
        .chr-band {
          background: var(--ground);
          color: var(--signal);
        }
        .chr-band-inner {
          padding-top: 96px;
          padding-bottom: 96px;
        }
        .chr-band-head { margin: 0 0 24px; max-width: 720px; }
        .chr-band-line {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 17px;
          line-height: 1.6;
          max-width: 520px;
          margin: 0 0 40px;
        }

        /* ── Links ── */
        .chr-links { padding-top: 96px; padding-bottom: 120px; }
        .chr-link-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .chr-link-label {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.04em;
        }
        .chr-link-url { font-size: 11px; color: var(--ground); text-decoration: none; }
      `}</style>
    </>
  );
}
