import Link from "next/link";
import { getAllProjects, findImage } from "@/lib/projects";
import { TrunkLine } from "@/components/TrunkLine";
import { FallbackImg } from "@/components/projects/tihif-nyc/FallbackImg";
import { FlowDiagram } from "@/components/projects/tihif-nyc/FlowDiagram";

export const metadata = {
  title: "This Is How I'm Feeling: NYC — SLBH",
  description:
    "A site-specific installation that streamed one person's daily emotion into three windows as colored light.",
};

export default function TihifNycPage() {
  const allProjects = getAllProjects();
  const relatedSlugs = ["acg", "american-emotions"];
  const related = relatedSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as (typeof allProjects)[0][];

  // Resolves public/projects/tihif-nyc/<base>.{webp,jpg,jpeg,png}
  const asset = (base: string) => findImage("tihif-nyc", base);
  const heroSrc = asset("hero");

  return (
    <>
      {/* ── Section 1: Header ── */}
      <section className="tihif-hero">
        <div className="container-page tihif-hero-inner">
          <p className="t-mono tihif-kicker">PROJECT 05 / 2025 / COMPLETE / NYC</p>
          <h1 className="t-display tihif-title">
            This Is How I&rsquo;m Feeling: NYC
          </h1>
          <p className="tihif-summary">
            A site-specific installation that streamed one person&rsquo;s daily
            emotion into three windows as colored light.
          </p>
        </div>
        <div className="tihif-trunkline">
          <TrunkLine length={110} nodePosition="top" />
        </div>
      </section>

      {/* ── Section 2: Readout strip ── */}
      <div className="hairline-t hairline-b tihif-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / PROJECTS / TIHIF: NYC
        </span>
        <span
          className="t-label tihif-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · SYSTEMS · DATA · TIME
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          STATUS: COMPLETE · 2025 · 3 WINDOWS
        </span>
      </div>

      {/* ── Section 3: Hero visual ── */}
      <section
        className="tihif-visual"
        aria-label="Installation documentation — three lit windows at night"
      >
        <div className="tihif-visual-bg" aria-hidden />
        {heroSrc ? (
          <FallbackImg
            src={heroSrc}
            alt="Night view from the street of three colored windows spilling light onto the sidewalk"
            className="tihif-visual-img"
          />
        ) : (
          <div className="tihif-visual-fallback">
            <span
              className="t-mono"
              style={{ color: "rgba(243, 242, 242, 0.4)", letterSpacing: "0.12em" }}
            >
              TK: HERO — NIGHT INSTALLATION, THREE LIT WINDOWS
            </span>
          </div>
        )}
      </section>

      {/* ── Section 4: Editorial ── */}
      <section className="container-page tihif-editorial">
        {/* Block A — PREMISE */}
        <div className="tihif-block tihif-block--full">
          <p className="t-mono tihif-block-kicker">01 / PREMISE</p>
          <h2 className="t-h2 tihif-block-headline">
            What if a private feeling spilled into public light?
          </h2>
          <p className="t-body tihif-block-body">
            The lab thinks about affective ecosystems, the way private emotion
            moves through shared space. This Is How I&rsquo;m Feeling: NYC
            asked the question directly. What happens if you put one
            person&rsquo;s emotion onto the street, in plain view, every night?
          </p>
          <p className="t-body tihif-block-body">
            The answer was a studio in New York, three windows, and a nightly
            broadcast of one feeling rendered as colored light.
          </p>
        </div>

        {/* Block B — PROCESS */}
        <div className="tihif-block tihif-block--diagram-left">
          <div className="tihif-block-visual tihif-flow-wrap">
            <FlowDiagram
              ariaLabel="Process pipeline: daily journal → emotion scoring → color assignment → LED stream across three windows"
              stages={[
                { primary: "DAILY", secondary: "JOURNAL" },
                { primary: "EMOTION", secondary: "SCORING" },
                { primary: "COLOR", secondary: "ASSIGNMENT" },
                { primary: "LED STREAM", secondary: "3 WINDOWS" },
              ]}
            />
          </div>
          <div className="tihif-block-text">
            <p className="t-mono tihif-block-kicker">02 / PROCESS</p>
            <h2 className="t-h2 tihif-block-headline">
              Journal, to emotion, to color, to light.
            </h2>
            <p className="t-body tihif-block-body">
              Each day began with a journal entry. The entry was translated into
              an emotion, and the emotion was translated into a color, using the
              same scoring process the lab uses for American Emotions and the
              broader research on color as an affective interface.
            </p>
            <p className="t-body tihif-block-body">
              The color was then streamed to three networked LED fixtures
              installed in the three windows of a studio in NYC. As the
              day&rsquo;s feeling shifted, so did the light. The building spoke
              for the interior.
            </p>
          </div>
        </div>

        {/* Block C — FRAME */}
        <div className="tihif-block tihif-block--full">
          <p className="t-mono tihif-block-kicker">03 / FRAME</p>
          <h2 className="t-h2 tihif-block-headline">
            A study in the permeability of affect.
          </h2>
          <p className="t-body tihif-block-body tihif-block-body--wide">
            The project is small in scale and direct in form. One person, one
            studio, one feeling per day, three points of light. But the frame is
            the lab&rsquo;s larger claim. Affect is not bounded by the body. It
            is a field phenomenon. It moves. It leaks. It can be made visible,
            and once visible, it becomes a shared coordinate.
          </p>
          <p className="t-body tihif-block-body tihif-block-body--wide">
            This Is How I&rsquo;m Feeling: NYC is the simplest possible
            demonstration of that claim. The subsequent work, ACG by SLBH,
            scales it.
          </p>
        </div>
      </section>

      {/* ── Section 6: Links ── */}
      <section className="container-page tihif-links">
        {[
          {
            label: "RELATED WORK",
            href: "/projects/acg",
            note: "/projects/acg",
          },
          {
            label: "READ THE THEORY",
            href: "/research/emotion-as-system",
            note: "/research/emotion-as-system",
          },
        ].map(({ label, href, note }, i) => (
          <div
            key={label}
            className="tihif-link-row"
            style={{ borderTop: i === 0 ? "0.5px solid var(--hairline)" : undefined }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: "0.04em",
              }}
            >
              {label}
            </span>
            <Link href={href} className="t-mono link-quiet tihif-link-url">
              {note} →
            </Link>
          </div>
        ))}
      </section>

      {/* ── Section 7: Related projects ── */}
      {related.length > 0 && (
        <section className="container-page tihif-related">
          <p className="t-mono tihif-related-label">RELATED PROJECTS</p>
          <div className="tihif-rel-grid">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="tihif-rel-card link-quiet"
              >
                <div className="tihif-rel-cover">
                  {p.coverPath && (
                    <FallbackImg
                      src={p.coverPath}
                      alt={p.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                </div>
                <div className="tihif-rel-meta">
                  <span
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      letterSpacing: "0.02em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {p.title}
                  </span>
                  <span className="t-mono" style={{ opacity: 0.55, fontSize: 10 }}>
                    {p.year}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Section 8: Footer ── */}
      <section className="container-page tihif-footer">
        <p className="t-body tihif-footer-body">
          This Is How I&rsquo;m Feeling: NYC ran as a site-specific installation
          in New York in 2025. It is complete. Its premise — that affect is a
          field phenomenon, visible and shared — continues in the lab&rsquo;s
          ongoing work.
        </p>
      </section>

      <style>{`
        /* ── Hero ── */
        .tihif-hero {
          position: relative;
        }
        .tihif-hero-inner {
          padding-top: 56px;
          padding-bottom: 144px;
        }
        .tihif-kicker {
          opacity: 0.55;
          margin: 0 0 20px;
        }
        .tihif-title {
          margin: 0 0 28px;
        }
        .tihif-summary {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 24px;
          line-height: 1.4;
          max-width: 680px;
          opacity: 0.82;
          margin: 0;
        }
        .tihif-trunkline {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        /* ── Readout strip ── */
        .tihif-readout {
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
          .tihif-readout { padding: 20px var(--pad-x); }
        }
        .tihif-readout-mid { display: none; }
        @media (min-width: 768px) {
          .tihif-readout-mid { display: block; }
        }

        /* ── Hero visual ── */
        .tihif-visual {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: var(--graphite);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tihif-visual-bg {
          position: absolute;
          inset: 0;
          background: var(--graphite);
        }
        .tihif-visual-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .tihif-visual-fallback {
          position: relative;
          z-index: 1;
          padding: 0 24px;
          text-align: center;
        }

        /* ── Editorial ── */
        .tihif-editorial {
          padding-top: 96px;
          padding-bottom: 96px;
          display: flex;
          flex-direction: column;
          gap: 96px;
        }
        @media (min-width: 900px) {
          .tihif-editorial { gap: 120px; }
        }

        .tihif-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 900px) {
          .tihif-block { grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
          .tihif-block--diagram-left .tihif-block-visual { order: -1; }
        }
        .tihif-block--full {
          display: block;
          max-width: 640px;
        }

        .tihif-block-kicker {
          opacity: 0.45;
          margin: 0 0 16px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .tihif-block-headline {
          margin: 0 0 28px;
        }
        .tihif-block-body {
          margin: 0 0 18px;
          max-width: 520px;
          line-height: 1.7;
          opacity: 0.82;
        }
        .tihif-block-body--wide {
          max-width: 640px;
        }
        .tihif-block-body:last-child { margin-bottom: 0; }

        /* Flow diagram */
        .tihif-flow-wrap {
          display: flex;
          align-items: center;
          padding: 32px 0;
        }

        /* ── Links ── */
        .tihif-links {
          padding-top: 0;
          padding-bottom: 80px;
        }
        .tihif-link-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .tihif-link-url {
          font-size: 11px;
          color: var(--ground);
          text-decoration: none;
        }

        /* ── Related ── */
        .tihif-related {
          padding-top: 0;
          padding-bottom: 80px;
        }
        .tihif-related-label {
          opacity: 0.45;
          margin: 0 0 32px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .tihif-rel-grid {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .tihif-rel-card {
          flex-shrink: 0;
          width: 240px;
          text-decoration: none;
          color: var(--ground);
          transition: opacity 600ms var(--ease-out);
        }
        .tihif-rel-grid:has(.tihif-rel-card:hover) .tihif-rel-card:not(:hover) {
          opacity: 0.35;
        }
        .tihif-rel-cover {
          width: 240px;
          height: 300px;
          background: var(--graphite);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .tihif-rel-meta { padding: 0 4px; }

        /* ── Footer copy ── */
        .tihif-footer {
          padding-top: 0;
          padding-bottom: 120px;
          max-width: var(--max-w);
        }
        .tihif-footer-body {
          max-width: 640px;
          line-height: 1.7;
          opacity: 0.72;
          margin: 0;
        }
      `}</style>
    </>
  );
}
