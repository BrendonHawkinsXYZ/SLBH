import Link from "next/link";
import { findAsset } from "@/lib/assets";
import { TrunkLine } from "@/components/TrunkLine";
import { FallbackImg } from "@/components/projects/FallbackImg";
import { FlowDiagram } from "@/components/projects/FlowDiagram";
import { ChromaDataModel } from "@/components/diagrams/ChromaDataModel";

// Scaffold: structure and labels are final, body copy is TK. Paragraphs marked
// .chr-tk are placeholders waiting on copy; drop screens into
// public/product/chroma/ and the frames fill in on their own.

export const metadata = {
  title: "Chroma — SLBH",
  description:
    "Chroma is the studio's affective color app. Launching September 2026.",
};

const LAUNCH = "SEPTEMBER 2026";
const CONTACT =
  "mailto:Brendon@studiolabbh.xyz?subject=Chroma%20%E2%80%94%20launch%20note";

export default function ChromaProductPage() {
  const asset = (base: string) => findAsset("product/chroma", base);
  const heroSrc = asset("hero");
  const whatSrc = asset("what-it-is");
  const screens: { base: string; caption: string; wide?: boolean }[] = [
    { base: "screen-01", caption: "TK / SCREEN" },
    { base: "screen-02", caption: "TK / SCREEN" },
    { base: "screen-03", caption: "TK / SCREEN" },
    { base: "screen-04", caption: "TK / SCREEN" },
  ];

  return (
    <>
      {/* ── Section 1: Header ── */}
      <section className="chr-hero">
        <div className="container-page chr-hero-inner">
          <p className="t-mono chr-kicker">PRODUCT / CHROMA / LAUNCHING {LAUNCH}</p>
          <h1 className="t-display chr-title">Chroma</h1>
          <p className="chr-summary chr-tk">
            TK — the one-sentence version of the app. What it does for the person
            holding it, in plain terms.
          </p>
          <div className="chr-hero-actions">
            <a href={CONTACT} className="t-nav link-quiet chr-cta">
              Get the launch note
            </a>
            <span className="t-mono chr-hero-note">LAUNCHING {LAUNCH}</span>
          </div>
        </div>
        <div className="chr-trunkline">
          <TrunkLine length={110} nodePosition="top" />
        </div>
      </section>

      {/* ── Section 2: Readout strip ── */}
      <div className="hairline-t hairline-b chr-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / PRODUCT / CHROMA
        </span>
        <span
          className="t-label chr-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · COLOR · DATA · TIME
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          STATUS: PRE-LAUNCH · {LAUNCH}
        </span>
      </div>

      {/* ── Section 3: Hero visual ── */}
      <section className="chr-visual" aria-label="Chroma app visual">
        <div className="chr-visual-bg" aria-hidden />
        {heroSrc && <FallbackImg src={heroSrc} alt="" className="chr-visual-img" />}
        {!heroSrc && (
          <div className="chr-visual-fallback" aria-hidden>
            <span className="t-mono" style={{ opacity: 0.3 }}>
              TK: APP VISUAL
            </span>
          </div>
        )}
      </section>

      {/* ── Section 4: Editorial ── */}
      <section className="container-page chr-editorial">
        {/* Block A — WHAT IT IS */}
        <div className="chr-block chr-block--text-left">
          <div className="chr-block-text">
            <p className="t-mono chr-block-kicker">01 / WHAT IT IS</p>
            <h2 className="t-h2 chr-block-headline chr-tk-head">
              TK — headline: what Chroma is.
            </h2>
            <p className="t-body chr-block-body chr-tk">
              TK — the app in a paragraph. What a person opens it to do, and what
              they get back.
            </p>
            <p className="t-body chr-block-body chr-tk">
              TK — the second paragraph. What makes it the studio&rsquo;s app
              rather than a generic color tool: the affective model underneath.
            </p>
          </div>
          <div className="chr-block-visual">
            <div className="chr-img-wrap">
              <div className="chr-img-frame chr-img-frame--tall">
                <div className="chr-img-bg" />
                {whatSrc && (
                  <FallbackImg
                    src={whatSrc}
                    alt="Chroma app screen"
                    className="chr-img-fill"
                  />
                )}
              </div>
              <p className="t-mono chr-img-caption">TK — CAPTION</p>
            </div>
          </div>
        </div>

        {/* Block B — HOW IT WORKS. Five stages, so the flow gets full width. */}
        <div className="chr-how">
          <div className="chr-block chr-block--full">
            <p className="t-mono chr-block-kicker">02 / HOW IT WORKS</p>
            <h2 className="t-h2 chr-block-headline chr-tk-head">
              TK — headline: the model behind the color.
            </h2>
            <p className="t-body chr-block-body chr-tk">
              TK — the pipeline in prose: what goes in, how it is scored, how a
              score becomes a color a person can act on.
            </p>
            <p className="t-body chr-block-body chr-tk">
              TK — what runs on the device, what runs in the studio&rsquo;s
              systems, and what is never stored.
            </p>
          </div>
          <div className="chr-flow-strip">
            <FlowDiagram
              ariaLabel="How it works: signal → cleansing → vectorizing → assigning → affective readout"
              stages={[
                { primary: "DATA", secondary: "SIGNAL" },
                { primary: "CLEANSING", secondary: "TK" },
                { primary: "VECTORIZING", secondary: "TK" },
                { primary: "ASSIGNING", secondary: "TK" },
                { primary: "AFFECTIVE", secondary: "READOUT" },
              ]}
            />
          </div>
        </div>

        {/* Block C — WHO IT IS FOR */}
        <div className="chr-block chr-block--full">
          <p className="t-mono chr-block-kicker">03 / WHO IT IS FOR</p>
          <h2 className="t-h2 chr-block-headline chr-tk-head">
            TK — headline: who should open this.
          </h2>
          <p className="t-body chr-block-body chr-block-body--wide chr-tk">
            TK — the audiences, named concretely, and the moment in their day
            when Chroma is the right thing to reach for.
          </p>
          <p className="t-body chr-block-body chr-block-body--wide chr-tk">
            TK — and who it is not for. The register the app refuses.
          </p>
        </div>
      </section>

      {/* ── Section 5: Data model figure ── */}
      <section className="container-page chr-figure">
        <div className="chr-figure-frame">
          <ChromaDataModel />
        </div>
        <p className="t-mono chr-figure-caption">
          FIG. 02 — CHROMA DATA MODEL · STUDIO LAB BH
        </p>
      </section>

      {/* ── Section 6: Capabilities ── */}
      <section className="container-page chr-caps">
        <div className="chr-caps-cols">
          <div className="chr-caps-col">
            <p className="t-mono chr-caps-label">IN THE FIRST RELEASE</p>
            <ul className="chr-caps-list">
              <li>TK — CAPABILITY</li>
              <li>TK — CAPABILITY</li>
              <li>TK — CAPABILITY</li>
              <li>TK — CAPABILITY</li>
              <li>TK — CAPABILITY</li>
            </ul>
          </div>
          <div className="chr-caps-col">
            <p className="t-mono chr-caps-label">AFTER LAUNCH</p>
            <ul className="chr-caps-list">
              <li>TK — ON THE ROADMAP</li>
              <li>TK — ON THE ROADMAP</li>
              <li>TK — ON THE ROADMAP</li>
              <li>TK — ON THE ROADMAP</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Section 7: Screens ── */}
      <section className="container-page chr-screens">
        <p className="t-mono chr-screens-label">SCREENS</p>
        <div className="chr-screen-grid">
          {screens.map((screen) => {
            const src = asset(screen.base);
            return (
              <figure key={screen.base} className="chr-screen-cell">
                <div className="chr-screen-frame">
                  <div className="chr-img-bg" />
                  {src && (
                    <FallbackImg
                      src={src}
                      alt={screen.caption}
                      className="chr-img-fill"
                    />
                  )}
                </div>
                <figcaption className="t-mono chr-screen-caption">
                  {screen.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* ── Section 8: Launch ── */}
      <section className="container-page chr-launch">
        <p className="t-mono chr-launch-label">LAUNCH</p>
        <div className="chr-launch-rows">
          {[
            { label: "LAUNCH", value: LAUNCH },
            { label: "PLATFORM", value: "TK" },
            { label: "ACCESS", value: "TK" },
            { label: "PRICE", value: "TK" },
            { label: "REGION", value: "TK" },
            { label: "STATUS", value: "PRE-LAUNCH" },
          ].map((row, i) => (
            <div
              key={row.label}
              className="chr-launch-row"
              style={{ borderTop: i === 0 ? "0.5px solid var(--hairline)" : undefined }}
            >
              <span className="chr-launch-key t-label">{row.label}</span>
              <span className="t-mono chr-launch-val">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 9: Closing CTA ── */}
      <section className="container-page chr-close">
        <h2 className="t-h2 chr-close-head">Chroma launches in September 2026.</h2>
        <p className="t-body chr-close-body chr-tk">
          TK — the closing line. What to expect between now and launch, and what
          signing up actually gets someone.
        </p>
        <a href={CONTACT} className="t-nav link-quiet chr-cta">
          Get the launch note
        </a>
      </section>

      {/* ── Section 10: Links ── */}
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
        .chr-tk-head { opacity: 0.5; }

        /* ── Hero ── */
        .chr-hero { position: relative; }
        .chr-hero-inner { padding-top: 56px; padding-bottom: 144px; }
        .chr-kicker { opacity: 0.55; margin: 0 0 20px; }
        .chr-title { margin: 0 0 28px; }
        .chr-summary {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 24px;
          line-height: 1.4;
          max-width: 680px;
          margin: 0 0 40px;
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
          padding: 12px 28px;
        }
        .chr-hero-note { opacity: 0.45; }
        .chr-trunkline {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        /* ── Readout strip ── */
        .chr-readout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px var(--pad-x-mobile);
          max-width: var(--max-w);
          margin-inline: auto;
          width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .chr-readout { padding: 20px var(--pad-x); }
        }
        .chr-readout-mid { display: none; }
        @media (min-width: 768px) {
          .chr-readout-mid { display: block; }
        }

        /* ── Hero visual ── */
        .chr-visual {
          min-height: 76vh;
          position: relative;
          overflow: hidden;
          background: var(--graphite);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chr-visual-bg { position: absolute; inset: 0; background: var(--graphite); }
        .chr-visual-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .chr-visual-fallback { position: relative; z-index: 1; }

        /* ── Editorial ── */
        .chr-editorial {
          padding-top: 96px;
          padding-bottom: 96px;
          display: flex;
          flex-direction: column;
          gap: 96px;
        }
        @media (min-width: 900px) {
          .chr-editorial { gap: 120px; }
        }
        .chr-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 900px) {
          .chr-block { grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
          .chr-block--diagram-left .chr-block-visual { order: -1; }
        }
        .chr-block--full { display: block; max-width: 640px; }

        .chr-block-kicker {
          opacity: 0.45;
          margin: 0 0 16px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .chr-block-headline { margin: 0 0 28px; }
        .chr-block-body { margin: 0 0 18px; max-width: 520px; line-height: 1.7; }
        .chr-block-body--wide { max-width: 640px; }
        .chr-block-body:last-child { margin-bottom: 0; }

        /* Image frames */
        .chr-img-wrap { width: 100%; }
        .chr-img-frame {
          position: relative;
          aspect-ratio: 4/3;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .chr-img-frame--tall { aspect-ratio: 4/5; max-width: 420px; }
        .chr-img-bg { position: absolute; inset: 0; background: var(--graphite); }
        .chr-img-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .chr-img-caption {
          margin: 12px 0 0;
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
        }

        .chr-flow-wrap { display: flex; align-items: center; padding: 32px 0; }
        .chr-how { display: flex; flex-direction: column; gap: 48px; }
        .chr-flow-strip {
          padding: 32px 0;
          border-top: 0.5px solid var(--hairline);
          border-bottom: 0.5px solid var(--hairline);
        }

        /* ── Data model figure ── */
        .chr-figure { padding-top: 0; padding-bottom: 96px; }
        .chr-figure-frame {
          width: 100%;
          max-width: 520px;
          border: 0.5px solid var(--hairline-strong);
          background: var(--ground);
          overflow: hidden;
        }
        .chr-figure-caption {
          margin: 12px 0 0;
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
        }

        /* ── Capabilities ── */
        .chr-caps { padding-top: 0; padding-bottom: 96px; }
        .chr-caps-cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 768px) {
          .chr-caps-cols { grid-template-columns: 1fr 1fr; gap: 64px; }
        }
        .chr-caps-label {
          opacity: 0.45;
          margin: 0 0 16px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .chr-caps-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-family: var(--font-plex-mono), ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          opacity: 0.78;
        }
        .chr-caps-list li {
          padding: 12px 0;
          border-top: 0.5px solid var(--hairline);
        }
        .chr-caps-list li:last-child { border-bottom: 0.5px solid var(--hairline); }

        /* ── Screens ── */
        .chr-screens { padding-top: 0; padding-bottom: 96px; }
        .chr-screens-label {
          opacity: 0.45;
          margin: 0 0 24px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .chr-screen-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (min-width: 768px) {
          .chr-screen-grid { grid-template-columns: repeat(4, 1fr); gap: 32px; }
        }
        .chr-screen-cell { margin: 0; }
        .chr-screen-frame {
          position: relative;
          aspect-ratio: 9/19.5;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .chr-screen-caption {
          margin: 12px 0 0;
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
        }

        /* ── Launch rows ── */
        .chr-launch { padding-top: 0; padding-bottom: 96px; }
        .chr-launch-label {
          opacity: 0.45;
          margin: 0 0 24px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .chr-launch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 20px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .chr-launch-key { font-size: 10px; letter-spacing: 0.14em; opacity: 0.72; }
        .chr-launch-val { font-size: 11px; opacity: 0.82; text-align: right; }

        /* ── Closing CTA ── */
        .chr-close { padding-top: 0; padding-bottom: 96px; }
        .chr-close-head { margin: 0 0 24px; max-width: 640px; }
        .chr-close-body { margin: 0 0 36px; max-width: 560px; line-height: 1.7; }

        /* ── Links ── */
        .chr-links { padding-top: 0; padding-bottom: 120px; }
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
