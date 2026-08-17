import Link from "next/link";

// Unlisted index page: not in the nav or sitemap, and kept out of search —
// same policy as the instruments it links to. Bookmark route for the lab.
export const metadata = {
  title: "Tools — SLBH",
  description: "Index of the lab's browser instruments — shapes, steps, trace, chroma, bloom, figure, glyph.",
  robots: { index: false, follow: false },
};

type Tool = {
  index: string;
  title: string;
  href: string;
  line: string;
  out: string;
};

const TOOLS: Tool[] = [
  {
    index: "01",
    title: "Shapes",
    href: "/shapes",
    line: "The home Field's mosaic as an instrument — pick a family, turn the dials, choose a ground.",
    out: "PNG",
  },
  {
    index: "02",
    title: "Steps",
    href: "/steps",
    line: "Illustrator's colour blend — stops, specified steps between them, RGB / LAB / HSL.",
    out: "PNG",
  },
  {
    index: "03",
    title: "Trace",
    href: "/trace",
    line: "Image Trace for sketches — threshold, despeckle, and smooth refit vector curves.",
    out: "SVG · PNG",
  },
  {
    index: "04",
    title: "Chroma",
    href: "/chroma",
    line: "Two to five shapes morphing across a 15-second loop on the CHROMA poster.",
    out: "MP4 · WEBM",
  },
  {
    index: "05",
    title: "Bloom",
    href: "/bloom",
    line: "A seed shape that grows, unfurls, and morphs into an end shape — play and scrub the bloom.",
    out: "ANIMATION",
  },
  {
    index: "06",
    title: "Figure",
    href: "/figure",
    line: "A pixel character — dress the figure, turn the grain, choose a ground, save the look.",
    out: "PNG · JSON",
  },
  {
    index: "07",
    title: "Glyph",
    href: "/glyph",
    line: "Kurita’s grid — pick the pixel count, fill the cells by hand, trace it to one vector path.",
    out: "SVG",
  },
];

export default function ToolsPage() {
  return (
    <>
      {/* Mono readout strip — same register as the projects index */}
      <div className="hairline-t hairline-b tls-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / TOOLS
        </span>
        <span className="t-label tls-readout-mid" style={{ opacity: 0.55, letterSpacing: "0.18em" }}>
          AFFECT · SYSTEMS · DATA · TIME
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          {String(TOOLS.length).padStart(2, "0")} INSTRUMENTS · IN-BROWSER
        </span>
      </div>

      <section className="container-page tls-section">
        <header className="tls-head">
          <p className="t-mono tls-kicker">SHAPES / INDEX</p>
          <h1 className="t-h1 tls-title">Instruments</h1>
          <p className="tls-deck">
            The lab&rsquo;s browser tools. Everything runs on your machine and
            exports clean assets. Unlisted — reachable from here, not the nav.
          </p>
        </header>

        <ul className="tls-list">
          {TOOLS.map((tool) => (
            <li key={tool.href} className="tls-row-item">
              <Link href={tool.href} className="tls-row-link link-quiet">
                <span className="tls-col-idx t-mono" style={{ opacity: 0.55 }}>
                  {tool.index}
                </span>
                <span className="tls-col-name">{tool.title}</span>
                <span className="tls-col-line">{tool.line}</span>
                <span className="tls-col-out t-label">{tool.out}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <style>{`
        .tls-readout {
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
          .tls-readout { padding: 20px var(--pad-x); }
        }
        .tls-readout-mid { display: none; }
        @media (min-width: 768px) {
          .tls-readout-mid { display: block; }
        }

        .tls-section {
          padding-top: 56px;
          padding-bottom: 120px;
        }
        .tls-head { padding-bottom: 48px; }
        .tls-kicker {
          opacity: 0.55;
          margin: 0 0 18px;
          letter-spacing: 0.18em;
        }
        .tls-title { margin: 0 0 18px; }
        .tls-deck {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.55;
          max-width: 540px;
          opacity: 0.72;
          margin: 0;
        }

        /* ── Row list — projects-index anatomy, text only ── */
        .tls-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .tls-row-item { border-top: 0.5px solid var(--hairline); }
        .tls-row-item:last-child { border-bottom: 0.5px solid var(--hairline); }

        .tls-row-link {
          display: flex;
          align-items: center;
          gap: 24px;
          height: 96px;
          text-decoration: none;
          color: var(--ground);
        }
        .tls-col-idx { width: 60px; flex-shrink: 0; font-size: 11px; }
        .tls-col-name {
          width: 200px;
          flex-shrink: 0;
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 22px;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .tls-col-line {
          flex: 1;
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 14px;
          line-height: 1.5;
          opacity: 0.6;
        }
        .tls-col-out {
          flex-shrink: 0;
          border: 1px solid var(--hairline-strong);
          padding: 6px 12px;
          font-size: 10px;
          letter-spacing: 0.14em;
          white-space: nowrap;
        }

        /* ── Mobile: stack the row ── */
        @media (max-width: 767px) {
          .tls-row-link {
            height: auto;
            padding: 24px 0;
            display: grid;
            grid-template-columns: 60px 1fr auto;
            grid-template-areas:
              "idx name out"
              "idx line line";
            align-items: baseline;
            row-gap: 10px;
          }
          .tls-col-idx { grid-area: idx; width: auto; }
          .tls-col-name { grid-area: name; width: auto; font-size: 19px; }
          .tls-col-line { grid-area: line; }
          .tls-col-out { grid-area: out; justify-self: end; }
        }
      `}</style>
    </>
  );
}
