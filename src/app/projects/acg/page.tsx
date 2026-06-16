import Link from "next/link";
import { getAllProjects, findImage } from "@/lib/projects";
import { TrunkLine } from "@/components/TrunkLine";
import { FallbackImg } from "@/components/projects/acg/FallbackImg";
import { FlowDiagram } from "@/components/projects/acg/FlowDiagram";

export const metadata = {
  title: "ACG by SLBH — SLBH",
  description:
    "An ongoing applied research series that translates affective computation into tangible public experiences through light, presence, color, and sensory systems.",
};

export default function ACGPage() {
  const allProjects = getAllProjects();
  const relatedSlugs = ["american-emotions", "tihif-nyc"];
  const related = relatedSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as (typeof allProjects)[0][];

  const asset = (base: string) => findImage("acg", base);
  const heroSrc = asset("hero");
  const conceptSrc = asset("concept");
  const storefrontSrc = asset("installation-storefront");
  const array01Src = asset("installation-array-01");
  const array02Src = asset("installation-array-02");
  const promptSrc = asset("activation-prompt");
  const roomSrc = asset("activation-room");
  const alignmentSrc = asset("activation-alignment");

  return (
    <>
      {/* ── Section 1: Header ── */}
      <section className="acg-hero">
        <div className="container-page acg-hero-inner">
          <p className="t-mono acg-kicker">PROJECT 04 / 2026 / ACTIVE / NYC</p>
          <h1 className="t-display acg-title">ACG by SLBH</h1>
          <p className="acg-summary">
            ACG by SLBH is an ongoing applied research series that turns
            affective computation into tangible experience through light, color,
            presence, and sensory systems.
          </p>
        </div>
        <div className="acg-trunkline">
          <TrunkLine length={110} nodePosition="top" />
        </div>
      </section>

      {/* ── Section 2: Readout strip ── */}
      <div className="hairline-t hairline-b acg-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / PROJECTS / ACG
        </span>
        <span
          className="t-label acg-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · SYSTEMS · DATA · LIGHT · PRESENCE
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          STATUS: ACTIVE · 2026 · APPLIED RESEARCH
        </span>
      </div>

      {/* ── Section 3: Hero visual ── */}
      <section className="acg-visual">
        <div className="acg-visual-bg" aria-hidden />
        {heroSrc && (
          <FallbackImg src={heroSrc} alt="" className="acg-visual-img" />
        )}
        <div className="acg-visual-fallback" aria-hidden>
          <span className="t-mono" style={{ opacity: 0.3 }}>
            TK: HERO VISUAL
          </span>
        </div>
      </section>

      {/* ── Section 4: Editorial ── */}
      <section className="container-page acg-editorial">
        {/* Block A — CONCEPT */}
        <div className="acg-block acg-block--text-left">
          <div className="acg-block-text">
            <p className="t-mono acg-block-kicker">01 / CONCEPT</p>
            <h2 className="t-h2 acg-block-headline">
              Affective computation, made physical.
            </h2>
            <p className="t-body acg-block-body">
              ACG by SLBH is where the lab&rsquo;s affective research becomes a
              tangible public experience. The project applies the computational
              logic of Affective Computational Geometry to real-world
              environments, translating emotional data into visible, spatial,
              and sensory forms.
            </p>
            <p className="t-body acg-block-body">
              The initial storefront activation uses light as the primary
              rendering method. But ACG is not only a light installation. It is
              an ongoing applied research series for testing how affective
              systems can be experienced through color, presence, space, scent,
              participation, and public programming.
            </p>
          </div>
          <div className="acg-block-visual">
            <div className="acg-img-wrap">
              <div className="acg-img-frame">
                <div className="acg-img-bg" />
                {conceptSrc && (
                  <FallbackImg
                    src={conceptSrc}
                    alt="ACG storefront concept render"
                    className="acg-img-fill"
                  />
                )}
              </div>
              <p className="t-mono acg-img-caption">
                STOREFRONT CONCEPT — RENDER
              </p>
            </div>
          </div>
        </div>

        {/* Block B — METHOD */}
        <div className="acg-block acg-block--diagram-left">
          <div className="acg-block-visual acg-flow-wrap">
            <FlowDiagram
              ariaLabel="Method: affective input → computational shell → rendering method → public experience"
              stages={[
                { primary: "AFFECTIVE", secondary: "INPUT" },
                { primary: "COMPUTATIONAL", secondary: "SHELL" },
                { primary: "RENDERING", secondary: "METHOD" },
                { primary: "PUBLIC", secondary: "EXPERIENCE" },
              ]}
            />
          </div>
          <div className="acg-block-text">
            <p className="t-mono acg-block-kicker">02 / METHOD</p>
            <h2 className="t-h2 acg-block-headline">
              The research becomes a system.
            </h2>
            <p className="t-body acg-block-body">
              ACG takes the lab&rsquo;s computational model of affect and gives
              it a shell. Data enters the system, is interpreted through
              emotional and color logic, and is rendered through a chosen
              medium.
            </p>
            <p className="t-body acg-block-body">
              In this first public version, the rendering method is light.
              Future versions may use other sensory or spatial outputs. The
              constant is the system: affective input, computational
              interpretation, and public rendering.
            </p>
            <p className="t-body acg-block-body">
              ACG is the applied layer of the research. It tests whether affect
              can be made legible outside the page, outside the diagram, and
              inside shared space.
            </p>
          </div>
        </div>

        {/* Block C — FIELD ONE */}
        <div className="acg-block acg-block--text-left">
          <div className="acg-block-text">
            <p className="t-mono acg-block-kicker">03 / FIELD ONE</p>
            <h2 className="t-h2 acg-block-headline">The collective field.</h2>
            <p className="t-body acg-block-body">
              One field is generated through American Emotions, the lab&rsquo;s
              continuous instrument for tracking collective affect through
              public data. The system reads the national emotional atmosphere
              and translates it into a color field.
            </p>
            <p className="t-body acg-block-body">
              In the storefront version of ACG, that field becomes light. As the
              national field shifts across the day, the installation shifts with
              it. The data remains computational, but its output becomes
              environmental.
            </p>
            <p className="t-body acg-block-body">
              This is the first time American Emotions has been rendered as a
              physical public system.
            </p>
          </div>
          <div className="acg-block-visual acg-flow-wrap">
            <FlowDiagram
              ariaLabel="Field One: American Emotions → collective field state → color translation → light array 01"
              stages={[
                { primary: "AMERICAN", secondary: "EMOTIONS" },
                { primary: "COLLECTIVE", secondary: "FIELD STATE" },
                { primary: "COLOR", secondary: "TRANSLATION" },
                { primary: "LIGHT", secondary: "ARRAY 01" },
              ]}
            />
          </div>
        </div>

        {/* Block D — FIELD TWO */}
        <div className="acg-block acg-block--diagram-left">
          <div className="acg-block-visual acg-flow-wrap">
            <FlowDiagram
              ariaLabel="Field Two: visitor prompt → emotion scoring → local field state → light array 02"
              stages={[
                { primary: "VISITOR", secondary: "PROMPT" },
                { primary: "EMOTION", secondary: "SCORING" },
                { primary: "LOCAL", secondary: "FIELD STATE" },
                { primary: "LIGHT", secondary: "ARRAY 02" },
              ]}
            />
          </div>
          <div className="acg-block-text">
            <p className="t-mono acg-block-kicker">04 / FIELD TWO</p>
            <h2 className="t-h2 acg-block-headline">The local field.</h2>
            <p className="t-body acg-block-body">
              A second field is generated by the people present in the room.
              Visitors are invited to respond to a simple affective prompt. Each
              response is interpreted through the same emotional and color logic
              used across SLBH&rsquo;s affective systems.
            </p>
            <p className="t-body acg-block-body">
              Those responses contribute to a local field: a live reading of the
              room&rsquo;s affective state. Over time, the installation
              accumulates the emotional presence of the people who enter it.
            </p>
            <p className="t-body acg-block-body">
              The room becomes both participant and instrument.
            </p>
          </div>
        </div>

        {/* Block E — READING */}
        <div className="acg-block acg-block--full">
          <p className="t-mono acg-block-kicker">05 / READING</p>
          <h2 className="t-h2 acg-block-headline">
            Two fields in the same space.
          </h2>
          <p className="t-body acg-block-body acg-block-body--wide">
            The storefront version of ACG places two affective fields in the
            same room: the collective field of American Emotions and the local
            field of visitor response.
          </p>
          <p className="t-body acg-block-body acg-block-body--wide">
            They are almost never the same color. When they are, something has
            happened: a moment of alignment between the emotional atmosphere
            outside the room and the emotional presence inside it.
          </p>
          <p className="t-body acg-block-body acg-block-body--wide">
            The installation is a reading instrument. It does not ask visitors
            only to look at light. It asks them to encounter affect as something
            with shape, scale, color, and duration.
          </p>
        </div>
      </section>

      {/* ── Section 4b: Documentation strip ── */}
      <section className="container-page acg-doc-strip">
        <div className="acg-doc-grid">
          <figure className="acg-doc-cell acg-doc-cell--wide">
            <div className="acg-doc-frame">
              <div className="acg-doc-bg" />
              {storefrontSrc && (
                <FallbackImg
                  src={storefrontSrc}
                  alt="ACG storefront installation, exterior at night"
                  className="acg-img-fill"
                />
              )}
            </div>
            <figcaption className="t-mono acg-doc-caption">
              INSTALLATION / STOREFRONT
            </figcaption>
          </figure>
          <figure className="acg-doc-cell">
            <div className="acg-doc-frame">
              <div className="acg-doc-bg" />
              {array01Src && (
                <FallbackImg
                  src={array01Src}
                  alt="Light Array 01, collective field"
                  className="acg-img-fill"
                />
              )}
            </div>
            <figcaption className="t-mono acg-doc-caption">
              LIGHT ARRAY 01 / COLLECTIVE
            </figcaption>
          </figure>
          <figure className="acg-doc-cell">
            <div className="acg-doc-frame">
              <div className="acg-doc-bg" />
              {array02Src && (
                <FallbackImg
                  src={array02Src}
                  alt="Light Array 02, local field"
                  className="acg-img-fill"
                />
              )}
            </div>
            <figcaption className="t-mono acg-doc-caption">
              LIGHT ARRAY 02 / LOCAL
            </figcaption>
          </figure>
          <figure className="acg-doc-cell">
            <div className="acg-doc-frame">
              <div className="acg-doc-bg" />
              {promptSrc && (
                <FallbackImg
                  src={promptSrc}
                  alt="Visitor prompt interface"
                  className="acg-img-fill"
                />
              )}
            </div>
            <figcaption className="t-mono acg-doc-caption">
              ACTIVATION / PROMPT
            </figcaption>
          </figure>
          <figure className="acg-doc-cell">
            <div className="acg-doc-frame">
              <div className="acg-doc-bg" />
              {roomSrc && (
                <FallbackImg
                  src={roomSrc}
                  alt="Visitors inside the activation"
                  className="acg-img-fill"
                />
              )}
            </div>
            <figcaption className="t-mono acg-doc-caption">
              ACTIVATION / ROOM
            </figcaption>
          </figure>
          <figure className="acg-doc-cell acg-doc-cell--wide">
            <div className="acg-doc-frame">
              <div className="acg-doc-bg" />
              {alignmentSrc && (
                <FallbackImg
                  src={alignmentSrc}
                  alt="Moment of alignment between collective and local fields"
                  className="acg-img-fill"
                />
              )}
            </div>
            <figcaption className="t-mono acg-doc-caption">
              ALIGNMENT / TWO FIELDS, ONE COLOR
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Section 5: Activation / Visit ── */}
      <section className="container-page acg-visit">
        <p className="t-mono acg-visit-label">ACTIVATION</p>
        <div className="acg-visit-rows">
          {[
            { label: "LOCATION", value: "The Space, UWS NYC" },
            { label: "DATES", value: "April 28-30, 2026" },
            { label: "HOURS", value: "24 Hours/Day" },
            {
              label: "FORMAT",
              value: "LIGHT INSTALLATION / PUBLIC PROMPT / SENSORY ACTIVATION",
            },
            { label: "STATUS", value: "ACTIVE SERIES" },
            { label: "NEXT ACTIVATION", value: "TBD" },
          ].map((row, i) => (
            <div
              key={row.label}
              className="acg-visit-row"
              style={{ borderTop: i === 0 ? "0.5px solid var(--hairline)" : undefined }}
            >
              <span className="acg-visit-key t-label">{row.label}</span>
              <span className="t-mono acg-visit-val">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 6: System Notes ── */}
      <section className="container-page acg-system">
        <div className="acg-system-inner">
          <div className="acg-system-text">
            <p className="t-mono acg-block-kicker">06 / SYSTEM NOTES</p>
            <h2 className="t-h2 acg-block-headline">
              A computational shell for affective rendering.
            </h2>
            <p className="t-body acg-block-body acg-block-body--wide">
              ACG operates as a translation system. It receives affective
              inputs, processes them through SLBH&rsquo;s emotional and color
              logic, and renders them through a physical or sensory output.
            </p>
            <p className="t-body acg-block-body acg-block-body--wide">
              The system is designed to be portable across contexts. A
              storefront, a retail activation, a public program, or a temporary
              installation can each become a site for testing how emotional
              data moves from abstraction into experience.
            </p>
          </div>

          <div className="acg-system-shell">
            <FlowDiagram
              ariaLabel="System shell: input type → field model → color logic → rendering output → public feedback"
              stages={[
                { primary: "INPUT", secondary: "TYPE" },
                { primary: "FIELD", secondary: "MODEL" },
                { primary: "COLOR", secondary: "LOGIC" },
                { primary: "RENDERING", secondary: "OUTPUT" },
                { primary: "PUBLIC", secondary: "FEEDBACK" },
              ]}
            />
          </div>

          <div className="acg-system-cols">
            <div className="acg-system-col">
              <p className="t-mono acg-system-col-label">INPUT TYPES</p>
              <ul className="acg-system-list">
                <li>PUBLIC DATA</li>
                <li>VISITOR RESPONSE</li>
                <li>LOCATION-BASED SIGNAL</li>
                <li>TEMPORAL FIELD STATE</li>
                <li>SENSORY PAIRING</li>
              </ul>
            </div>
            <div className="acg-system-col">
              <p className="t-mono acg-system-col-label">RENDERING OUTPUTS</p>
              <ul className="acg-system-list">
                <li>LIGHT</li>
                <li>COLOR</li>
                <li>SCENT</li>
                <li>PRINTED MATTER</li>
                <li>ID CARD</li>
                <li>MAP</li>
                <li>PUBLIC DISPLAY</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Links ── */}
      <section className="container-page acg-links">
        {[
          {
            label: "AMERICAN EMOTIONS",
            href: "/projects/american-emotions",
            note: "/projects/american-emotions",
          },
          {
            label: "THIS IS HOW I'M FEELING: NYC",
            href: "/projects/tihif-nyc",
            note: "/projects/tihif-nyc",
          },
          {
            label: "READ THE THEORY",
            href: "/research/emotion-as-system",
            note: "/research/emotion-as-system",
          },
        ].map(({ label, href, note }, i) => (
          <div
            key={label}
            className="acg-link-row"
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
            <Link href={href} className="t-mono link-quiet acg-link-url">
              {note} →
            </Link>
          </div>
        ))}
      </section>

      {/* ── Section 8: Related projects ── */}
      {related.length > 0 && (
        <section className="container-page acg-related">
          <p className="t-mono acg-related-label">RELATED PROJECTS</p>
          <div className="acg-rel-grid">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="acg-rel-card link-quiet"
              >
                <div className="acg-rel-cover">
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
                <div className="acg-rel-meta">
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

      {/* ── Section 9: Footer ── */}
      <section className="container-page acg-footer">
        <p className="t-body acg-footer-body">
          ACG by SLBH is an ongoing applied research series. Future activations
          will continue testing how affective computation can be rendered
          through public experience, sensory systems, and everyday environments.
        </p>
      </section>

      <style>{`
        /* ── Hero ── */
        .acg-hero {
          position: relative;
        }
        .acg-hero-inner {
          padding-top: 56px;
          padding-bottom: 144px;
        }
        .acg-kicker {
          opacity: 0.55;
          margin: 0 0 20px;
        }
        .acg-title {
          margin: 0 0 28px;
        }
        .acg-summary {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 24px;
          line-height: 1.4;
          max-width: 680px;
          opacity: 0.82;
          margin: 0;
        }
        .acg-trunkline {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        /* ── Readout strip ── */
        .acg-readout {
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
          .acg-readout { padding: 20px var(--pad-x); }
        }
        .acg-readout-mid { display: none; }
        @media (min-width: 768px) {
          .acg-readout-mid { display: block; }
        }

        /* ── Hero visual ── */
        .acg-visual {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: var(--graphite);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .acg-visual-bg {
          position: absolute;
          inset: 0;
          background: var(--graphite);
        }
        .acg-visual-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .acg-visual-fallback {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Editorial ── */
        .acg-editorial {
          padding-top: 96px;
          padding-bottom: 96px;
          display: flex;
          flex-direction: column;
          gap: 96px;
        }
        @media (min-width: 900px) {
          .acg-editorial { gap: 120px; }
        }

        .acg-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 900px) {
          .acg-block { grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
          .acg-block--diagram-left .acg-block-visual { order: -1; }
        }
        .acg-block--full {
          display: block;
          max-width: 640px;
        }

        .acg-block-kicker {
          opacity: 0.45;
          margin: 0 0 16px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .acg-block-headline {
          margin: 0 0 28px;
        }
        .acg-block-body {
          margin: 0 0 18px;
          max-width: 520px;
          line-height: 1.7;
          opacity: 0.82;
        }
        .acg-block-body--wide {
          max-width: 640px;
        }
        .acg-block-body:last-child { margin-bottom: 0; }

        /* Image frame, used by concept image and doc strip */
        .acg-img-wrap { width: 100%; }
        .acg-img-frame {
          position: relative;
          aspect-ratio: 4/3;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .acg-img-bg {
          position: absolute;
          inset: 0;
          background: var(--graphite);
        }
        .acg-img-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .acg-img-caption {
          margin: 12px 0 0;
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
        }

        /* Flow diagrams */
        .acg-flow-wrap {
          display: flex;
          align-items: center;
          padding: 32px 0;
        }

        /* ── Documentation strip ── */
        .acg-doc-strip {
          padding-top: 0;
          padding-bottom: 96px;
        }
        .acg-doc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 768px) {
          .acg-doc-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }
          .acg-doc-cell--wide { grid-column: span 2; }
        }
        .acg-doc-cell { margin: 0; }
        .acg-doc-frame {
          position: relative;
          aspect-ratio: 4/3;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .acg-doc-cell--wide .acg-doc-frame {
          aspect-ratio: 16/9;
        }
        .acg-doc-bg {
          position: absolute;
          inset: 0;
          background: var(--graphite);
        }
        .acg-doc-caption {
          margin: 12px 0 0;
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
        }

        /* ── Visit / Activation ── */
        .acg-visit {
          padding-top: 0;
          padding-bottom: 96px;
        }
        .acg-visit-label {
          opacity: 0.45;
          margin: 0 0 24px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .acg-visit-rows {
          width: 100%;
        }
        .acg-visit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 20px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .acg-visit-key {
          font-size: 10px;
          letter-spacing: 0.14em;
          opacity: 0.72;
        }
        .acg-visit-val {
          font-size: 11px;
          opacity: 0.82;
          text-align: right;
        }

        /* ── System notes ── */
        .acg-system {
          padding-top: 0;
          padding-bottom: 96px;
        }
        .acg-system-inner {
          display: flex;
          flex-direction: column;
          gap: 64px;
        }
        .acg-system-text { max-width: 640px; }
        .acg-system-shell {
          padding: 32px 0;
          border-top: 0.5px solid var(--hairline);
          border-bottom: 0.5px solid var(--hairline);
        }
        .acg-system-cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 768px) {
          .acg-system-cols { grid-template-columns: 1fr 1fr; gap: 64px; }
        }
        .acg-system-col-label {
          opacity: 0.45;
          margin: 0 0 16px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .acg-system-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-family: var(--font-plex-mono), ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          opacity: 0.78;
        }
        .acg-system-list li {
          padding: 8px 0;
          border-top: 0.5px solid var(--hairline);
        }
        .acg-system-list li:last-child {
          border-bottom: 0.5px solid var(--hairline);
        }

        /* ── Links ── */
        .acg-links {
          padding-top: 0;
          padding-bottom: 80px;
        }
        .acg-link-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .acg-link-url {
          font-size: 11px;
          color: var(--ground);
          text-decoration: none;
        }

        /* ── Related ── */
        .acg-related {
          padding-top: 0;
          padding-bottom: 80px;
        }
        .acg-related-label {
          opacity: 0.45;
          margin: 0 0 32px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .acg-rel-grid {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .acg-rel-card {
          flex-shrink: 0;
          width: 240px;
          text-decoration: none;
          color: var(--ground);
          transition: opacity 600ms var(--ease-out);
        }
        .acg-rel-grid:has(.acg-rel-card:hover) .acg-rel-card:not(:hover) {
          opacity: 0.35;
        }
        .acg-rel-cover {
          width: 240px;
          height: 300px;
          background: var(--graphite);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .acg-rel-meta { padding: 0 4px; }

        /* ── Footer copy ── */
        .acg-footer {
          padding-top: 0;
          padding-bottom: 120px;
          max-width: var(--max-w);
        }
        .acg-footer-body {
          max-width: 640px;
          line-height: 1.7;
          opacity: 0.72;
          margin: 0;
        }
      `}</style>
    </>
  );
}
