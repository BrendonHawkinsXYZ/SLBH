import { FieldMark } from "@/components/FieldMark";
import { TrunkLine } from "@/components/TrunkLine";

export const metadata = {
  title: "Studio — SLBH",
  description:
    "Studio Lab BH is a systems research lab building computational models, instruments, and environments to understand and shape invisible human systems.",
};

const DISCIPLINES = [
  {
    label: "FIELDS",
    body: "Continuous systems, invisible forces, emergent behavior.",
  },
  {
    label: "FLOW",
    body: "Direction, velocity, attractor, repulsion, transformation.",
  },
  {
    label: "LAYERS",
    body: "Temporal depth, superposition, uncertainty.",
  },
  {
    label: "MEASUREMENT",
    body: "Axes, scales, calibration, evidence.",
  },
];

const FOCUS_AREAS = [
  {
    label: "AFFECTIVE COMPUTATIONAL GEOMETRY",
    body: "[TK 2 sentences — describe ACG focus.]",
  },
  {
    label: "COLLECTIVE FIELD DYNAMICS",
    body: "[TK 2 sentences — describe collective field dynamics.]",
  },
  {
    label: "PAIN AS INTERFACE",
    body: "[TK 2 sentences — describe pain-as-interface.]",
  },
];

const TENETS = [
  {
    n: "01",
    title: "LEAD WITH DESIGN THINKING",
    body: "[TK — verbatim from userPreferences.]",
  },
  {
    n: "02",
    title: "DATA FOUNDATION",
    body: "[TK — verbatim from userPreferences.]",
  },
  {
    n: "03",
    title: "COLOR AS LANGUAGE",
    body: "[TK — verbatim from userPreferences.]",
  },
  {
    n: "04",
    title: "CULTURE HAS VALUE",
    body: "[TK — verbatim from userPreferences.]",
  },
  {
    n: "05",
    title: "MEDIA AS COMMUNICATION",
    body: "[TK — verbatim from userPreferences.]",
  },
  {
    n: "06",
    title: "ENGINEERING DNA",
    body: "[TK — verbatim from userPreferences.]",
  },
  {
    n: "07",
    title: "FLUID BOUNDARIES",
    body: "[TK — verbatim from userPreferences.]",
  },
];

const AFFILIATIONS = [
  { role: "FOUNDER", org: "Studio Lab BH" },
  {
    role: "INTERIM FOUNDING BOARD CHAIR",
    org: "PIT Lab at CUNY",
  },
  { role: "ADVISORY / BOARD", org: "TK" },
];

// Deterministic pseudo-random for the compass point field
function seeded(i: number): number {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const COMPASS_POINTS = Array.from({ length: 90 }, (_, i) => {
  const angle = seeded(i) * Math.PI * 2;
  // bias radius toward center via squaring [0, 1]
  const r = Math.pow(seeded(i + 313), 2.2) * 150;
  return {
    cx: 240 + Math.cos(angle) * r,
    cy: 240 + Math.sin(angle) * r,
    r: 0.8 + seeded(i + 777) * 0.8,
  };
});

function CompassDiagram() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 480"
      className="st-compass"
      aria-hidden
    >
      {/* axes */}
      <line x1="240" y1="40" x2="240" y2="440" stroke="var(--ground)" strokeOpacity="0.16" strokeWidth="0.5" />
      <line x1="40" y1="240" x2="440" y2="240" stroke="var(--ground)" strokeOpacity="0.16" strokeWidth="0.5" />

      {/* concentric reference rings */}
      <circle cx="240" cy="240" r="60" fill="none" stroke="var(--ground)" strokeOpacity="0.08" strokeWidth="0.5" />
      <circle cx="240" cy="240" r="120" fill="none" stroke="var(--ground)" strokeOpacity="0.06" strokeWidth="0.5" />

      {/* dense point field */}
      {COMPASS_POINTS.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="var(--ground)" fillOpacity={0.6} />
      ))}

      {/* axis labels */}
      <text x="240" y="28" textAnchor="middle" className="st-compass-label">RESEARCH</text>
      <text x="452" y="244" textAnchor="end" className="st-compass-label">DESIGN</text>
      <text x="240" y="460" textAnchor="middle" className="st-compass-label">ENGINEERING</text>
      <text x="28" y="244" textAnchor="start" className="st-compass-label">THEORY</text>
    </svg>
  );
}

export default function StudioPage() {
  return (
    <>
      {/* ── §10.1 Header ── */}
      <section className="st-header">
        <div className="container-page st-header-inner">
          <p className="t-mono st-kicker">STUDIO</p>
          <h1 className="t-display st-headline">
            The lab, and the person running it.
          </h1>
          <p className="st-deck">
            [TK 1–2 sentences introducing the dual structure: a research lab,
            and the founder behind it.]
          </p>
        </div>
        <div className="st-header-trunk">
          <TrunkLine length={110} nodePosition="bottom" />
        </div>
      </section>

      {/* ── §10.2 Mono readout strip ── */}
      <div className="hairline-t hairline-b st-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / STUDIO
        </span>
        <span
          className="t-label st-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · SYSTEMS · DATA · TIME
        </span>
        <span
          className="t-mono"
          style={{ opacity: 0.55, textAlign: "right" }}
        >
          EST. 2024 · NEW YORK, NY
        </span>
      </div>

      {/* ── §10.3 Section A — SLBH ── */}
      <section id="slbh" aria-labelledby="section-a-heading">
        <div className="hairline-t hairline-b st-section-bar">
          <span className="t-mono" style={{ opacity: 0.55 }}>
            SECTION A
          </span>
          <span id="section-a-heading" className="st-section-title">
            STUDIO LAB BH
          </span>
          <span className="st-section-mark" aria-hidden>
            <FieldMark size="sm" />
          </span>
        </div>

        {/* Manifesto */}
        <div className="container-page st-manifesto">
          <h2 className="t-h2 st-manifesto-headline">
            Modeling invisible human systems.
          </h2>
          <div className="st-manifesto-body">
            <p className="t-body st-manifesto-para">
              Studio Lab BH is a systems research lab. We build computational
              models, instruments, and environments to understand and shape
              invisible human systems — especially affect.
            </p>
            <p className="t-body st-manifesto-para">
              Our work sits at the intersection of research, design, and
              engineering. We publish papers, ship instruments, and release
              diagrams as first-class research artifacts. Everything we make
              is built to be read, cited, and used.
            </p>
            <p className="t-body st-manifesto-para">
              The lab&rsquo;s core axiom is simple. Affect has value. It is a
              structured, measurable, collective phenomenon, and treating it as
              such unlocks a class of problems that current models can&rsquo;t
              touch.
            </p>
          </div>
        </div>

        {/* Disciplines */}
        <div className="container-page st-disciplines-wrap">
          <ul className="st-disciplines">
            {DISCIPLINES.map((d) => (
              <li key={d.label} className="st-discipline">
                <span className="t-label st-discipline-label">{d.label}</span>
                <span className="t-body-sm st-discipline-body">{d.body}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Methodology compass */}
        <div className="container-page st-compass-wrap">
          <CompassDiagram />
        </div>

        {/* Current focus */}
        <div className="container-page st-focus">
          <h3 className="t-h3 st-focus-header">CURRENT FOCUS</h3>
          <div className="st-focus-list">
            {FOCUS_AREAS.map((f) => (
              <div key={f.label} className="st-focus-item">
                <p className="t-label st-focus-label">{f.label}</p>
                <p className="t-body st-focus-body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §10.4 Section B — Brendon ── */}
      <section id="brendon" aria-labelledby="section-b-heading">
        <div className="hairline-t hairline-b st-section-bar">
          <span className="t-mono" style={{ opacity: 0.55 }}>
            SECTION B
          </span>
          <span id="section-b-heading" className="st-section-title">
            BRENDON MATUSCH / FOUNDER
          </span>
          <span className="st-section-avatar" aria-hidden>
            <img
              src="/studio/brendon-avatar.png"
              alt=""
              className="st-avatar-img"
            />
          </span>
        </div>

        {/* Intro block */}
        <div className="container-page st-intro">
          <div className="st-intro-portrait-wrap">
            <div className="st-intro-portrait-frame">
              <div className="st-intro-portrait-bg" aria-hidden />
              <img
                src="/studio/brendon-portrait.png"
                alt="Brendon Matusch"
                className="st-intro-portrait-img"
              />
            </div>
          </div>
          <div className="st-intro-bio">
            <p className="t-body st-intro-para">
              Brendon Matusch is the founder of Studio Lab BH, and Interim
              Founding Board Chair at PIT Lab at CUNY. His work builds
              computational frameworks for affect — how emotion behaves as a
              structured system across populations, platforms, and time.
            </p>
            <p className="t-body st-intro-para">
              His practice is interdisciplinary by design. He trained as an
              artist and works as a technologist, with a background spanning
              art, research, and product. Prior work centered on time,
              identity, and language as systems; current work formalizes
              affect as the missing layer in how we model human experience.
            </p>
            <p className="t-body st-intro-para">
              Based in New York. Formative roots in Pittsburgh. Studies ASL.
              Reads widely.
            </p>
          </div>
        </div>

        {/* Practice tenets */}
        <div className="container-page st-tenets">
          <ul className="st-tenets-grid">
            {TENETS.map((t) => (
              <li key={t.n} className="st-tenet">
                <span className="st-tenet-number">{t.n}</span>
                <p className="st-tenet-title">{t.title}</p>
                <p className="st-tenet-body">{t.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Affiliations */}
        <div className="container-page st-affil">
          <h3 className="t-h3 st-affil-header">CURRENT AFFILIATIONS</h3>
          <ul className="st-affil-list">
            {AFFILIATIONS.map((a) => (
              <li key={a.role} className="st-affil-row">
                <span className="t-label st-affil-role">{a.role}</span>
                <span className="t-mono st-affil-org">{a.org}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="container-page st-contact">
          <h3 className="t-h3 st-contact-header">CONTACT</h3>
          <ul className="st-contact-list">
            <li className="st-contact-row">
              <span className="t-label st-contact-label">EMAIL</span>
              <span className="t-mono st-contact-value">[TK]</span>
            </li>
            <li className="st-contact-row">
              <span className="t-label st-contact-label">INSTAGRAM</span>
              <a
                href="https://instagram.com/studiolabbh"
                target="_blank"
                rel="noopener noreferrer"
                className="t-mono st-contact-value link-quiet"
              >
                @studiolabbh ↗
              </a>
            </li>
          </ul>
        </div>
      </section>

      <style>{`
        /* ── §10.1 Header ── */
        .st-header {
          min-height: 60vh;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .st-header-inner {
          padding-top: 80px;
          padding-bottom: 80px;
        }
        .st-kicker {
          opacity: 0.55;
          margin: 0 0 20px;
          letter-spacing: 0.18em;
        }
        .st-headline {
          margin: 0 0 28px;
          max-width: 18ch;
        }
        .st-deck {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 17px;
          line-height: 1.5;
          max-width: 520px;
          opacity: 0.72;
          margin: 0;
        }
        .st-header-trunk {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        /* ── §10.2 Readout strip ── */
        .st-readout {
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
          .st-readout { padding: 20px var(--pad-x); }
        }
        .st-readout-mid { display: none; }
        @media (min-width: 1024px) {
          .st-readout-mid { display: block; }
        }

        /* ── Section bar (shared by §10.3 and §10.4) ── */
        .st-section-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 48px var(--pad-x-mobile);
          max-width: var(--max-w);
          margin-inline: auto;
          width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .st-section-bar { padding: 48px var(--pad-x); }
        }
        .st-section-title {
          font-family: var(--font-orbitron), sans-serif;
          font-weight: 500;
          font-size: clamp(16px, 2vw, 24px);
          letter-spacing: 0.18em;
          text-align: center;
        }
        .st-section-mark { display: flex; align-items: center; justify-content: flex-end; }
        .st-section-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 0.5px solid var(--hairline-strong);
          background: var(--graphite);
          flex-shrink: 0;
        }
        .st-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── §10.3 Manifesto ── */
        .st-manifesto {
          padding-top: 24px;
          padding-bottom: 96px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 900px) {
          .st-manifesto {
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: start;
          }
        }
        .st-manifesto-headline {
          margin: 0;
          max-width: 14ch;
        }
        .st-manifesto-body { display: flex; flex-direction: column; gap: 18px; max-width: 520px; }
        .st-manifesto-para {
          margin: 0;
          line-height: 1.65;
          font-size: 16px;
          opacity: 0.85;
        }

        /* ── §10.3 Disciplines grid ── */
        .st-disciplines-wrap {
          padding-top: 0;
          padding-bottom: 96px;
        }
        .st-disciplines {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr;
          border-top: 0.5px solid var(--hairline);
        }
        @media (min-width: 720px) {
          .st-disciplines { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .st-disciplines { grid-template-columns: repeat(4, 1fr); }
        }
        .st-discipline {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 32px 24px;
          border-bottom: 0.5px solid var(--hairline);
          border-right: 0.5px solid var(--hairline);
        }
        @media (min-width: 720px) {
          .st-discipline:nth-child(2n) { border-right: none; }
        }
        @media (min-width: 1024px) {
          .st-discipline:nth-child(2n) { border-right: 0.5px solid var(--hairline); }
          .st-discipline:nth-child(4n) { border-right: none; }
        }
        .st-discipline-label {
          font-size: 12px;
          letter-spacing: 0.14em;
        }
        .st-discipline-body {
          font-size: 14px;
          opacity: 0.75;
          line-height: 1.5;
          margin: 0;
        }

        /* ── §10.3 Compass ── */
        .st-compass-wrap {
          padding-top: 0;
          padding-bottom: 96px;
          display: flex;
          justify-content: center;
        }
        .st-compass {
          width: min(480px, 100%);
          height: auto;
          aspect-ratio: 1 / 1;
        }
        .st-compass-label {
          font-family: var(--font-orbitron), sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.14em;
          fill: var(--ground);
          opacity: 0.72;
        }

        /* ── §10.3 Current focus ── */
        .st-focus {
          padding-top: 0;
          padding-bottom: 96px;
        }
        .st-focus-header {
          margin: 0 0 32px;
          opacity: 0.72;
        }
        .st-focus-list {
          display: flex;
          flex-direction: column;
          gap: 32px;
          max-width: 640px;
        }
        .st-focus-item {
          padding-top: 24px;
          border-top: 0.5px solid var(--hairline);
        }
        .st-focus-item:first-child {
          padding-top: 0;
          border-top: none;
        }
        .st-focus-label {
          font-size: 11px;
          letter-spacing: 0.14em;
          margin: 0 0 12px;
        }
        .st-focus-body {
          margin: 0;
          line-height: 1.65;
          opacity: 0.85;
        }

        /* ── §10.4 Intro block ── */
        .st-intro {
          padding-top: 24px;
          padding-bottom: 96px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 900px) {
          .st-intro {
            grid-template-columns: 2fr 3fr;
            gap: 80px;
            align-items: start;
          }
        }
        .st-intro-portrait-wrap { width: 100%; max-width: 480px; }
        .st-intro-portrait-frame {
          position: relative;
          aspect-ratio: 4 / 5;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .st-intro-portrait-bg {
          position: absolute;
          inset: 0;
          background: var(--graphite);
        }
        .st-intro-portrait-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .st-intro-bio {
          display: flex;
          flex-direction: column;
          gap: 18px;
          max-width: 560px;
        }
        .st-intro-para {
          margin: 0;
          line-height: 1.65;
          font-size: 16px;
          opacity: 0.85;
        }

        /* ── §10.4 Practice tenets ── */
        .st-tenets {
          padding-top: 0;
          padding-bottom: 96px;
        }
        .st-tenets-grid {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px 64px;
        }
        @media (min-width: 720px) {
          .st-tenets-grid { grid-template-columns: 1fr 1fr; }
        }
        .st-tenet { display: flex; flex-direction: column; gap: 12px; max-width: 360px; }
        .st-tenet-number {
          font-family: var(--font-orbitron), sans-serif;
          font-weight: 500;
          font-size: 48px;
          line-height: 1;
          opacity: 0.35;
        }
        .st-tenet-title {
          font-family: var(--font-orbitron), sans-serif;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 0;
        }
        .st-tenet-body {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 14px;
          line-height: 1.55;
          opacity: 0.75;
          margin: 0;
        }

        /* ── §10.4 Affiliations ── */
        .st-affil {
          padding-top: 0;
          padding-bottom: 96px;
        }
        .st-affil-header {
          margin: 0 0 32px;
          opacity: 0.72;
        }
        .st-affil-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .st-affil-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          padding: 20px 0;
          border-top: 0.5px solid var(--hairline);
        }
        @media (min-width: 720px) {
          .st-affil-row {
            grid-template-columns: 280px 1fr;
            gap: 24px;
            align-items: baseline;
          }
        }
        .st-affil-list li:last-child {
          border-bottom: 0.5px solid var(--hairline);
        }
        .st-affil-role {
          font-size: 11px;
          letter-spacing: 0.14em;
        }
        .st-affil-org {
          font-size: 13px;
          opacity: 0.85;
        }

        /* ── §10.4 Contact ── */
        .st-contact {
          padding-top: 0;
          padding-bottom: 96px;
        }
        .st-contact-header {
          margin: 0 0 32px;
          opacity: 0.72;
        }
        .st-contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .st-contact-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          padding: 20px 0;
          border-top: 0.5px solid var(--hairline);
        }
        @media (min-width: 720px) {
          .st-contact-row {
            grid-template-columns: 280px 1fr;
            gap: 24px;
            align-items: baseline;
          }
        }
        .st-contact-list li:last-child {
          border-bottom: 0.5px solid var(--hairline);
        }
        .st-contact-label {
          font-size: 11px;
          letter-spacing: 0.14em;
        }
        .st-contact-value {
          font-size: 13px;
          opacity: 0.85;
          color: var(--ground);
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
