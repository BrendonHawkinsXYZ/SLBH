import { FieldMark } from "@/components/FieldMark";

export const metadata = {
  title: "Studio — SLBH",
  description:
    "Studio Lab BH is a systems research lab building computational models, instruments, and environments to understand and shape invisible human systems.",
};

const FOCUS_AREAS = [
  {
    label: "CHROMA — LAUNCHING SEPTEMBER 2026",
    body: "Chroma is the lab’s first personal affect instrument: a private place to give feeling a form, preserve it over time, and see the patterns that individual moments can hide. It translates the lab’s research into an everyday product.",
  },
];

const TENETS = [
  {
    n: "01",
    title: "LEAD WITH DESIGN THINKING",
    body: "Identifying emerging trends, noticing intuitive patterns, and exploring abstract concepts to define the foundation of research and projects.",
  },
  {
    n: "02",
    title: "DATA FOUNDATION",
    body: "Using data to validate and guide research, projects, and experiments, building on insights from design thinking.",
  },
  {
    n: "03",
    title: "COLOR AS LANGUAGE",
    body: "Exploring color’s fundamental role in perception and its significance across human, ecological, and biological systems.",
  },
  {
    n: "04",
    title: "CULTURE HAS VALUE",
    body: "Emphasizing culture’s foundational role in shaping human theories, social constructs, and engagements.",
  },
  {
    n: "05",
    title: "MEDIA AS COMMUNICATION",
    body: "Leveraging media to engage with culture, share theories, and promote projects, integrating it deeply into the research process.",
  },
  {
    n: "06",
    title: "ENGINEERING DNA",
    body: "Emphasizing a problem-solving mindset, where every project and research effort is guided by engineering principles to address and solve problems.",
  },
  {
    n: "07",
    title: "FLUID BOUNDARIES",
    body: "Adapting the practice to address emerging problems, ensuring flexibility and growth over time.",
  },
];

const AFFILIATIONS = [
  { role: "FOUNDER", org: "Studio Lab BH" },
  {
    role: "FOUNDING BOARD CHAIR",
    org: "PIT Lab at CUNY",
  },
];

type CVEntry = { year?: string; title: string; detail?: string };
type CVCategory = { label: string; entries: CVEntry[] };

const CV: CVCategory[] = [
  {
    label: "SOLO EXHIBITIONS",
    entries: [
      { year: "2026", title: "ACG By Studio Lab BH", detail: "The Space, New York, NY" },
      { year: "2024", title: "Three Degrees", detail: "Industrious, Pittsburgh, PA" },
      { year: "2019", title: "#ShowUp", detail: "Mattress Factory, Pittsburgh, PA" },
      { year: "2018", title: "Untitled", detail: "Bunker Projects, Pittsburgh, PA" },
    ],
  },
  {
    label: "GROUP EXHIBITIONS",
    entries: [
      { year: "2025", title: "PIT Lab × Beta NYC Pop-Up", detail: "The Oculus, New York, NY" },
      { year: "2020", title: "Seeking Truth", detail: "Brew House, Pittsburgh, PA" },
      { year: "2020", title: "Channel", detail: "Pittsburgh Children’s Museum, Pittsburgh, PA" },
      {
        year: "2019",
        title: "The Self, Realized: Queering the Art of Self-Portraiture",
        detail: "Brewhouse, Pittsburgh, PA",
      },
      { year: "2018", title: "The House We Build", detail: "Imagebox Gallery, Pittsburgh, PA" },
      { year: "2017", title: "Welcome Home", detail: "Future Tenant, Pittsburgh, PA" },
    ],
  },
  {
    label: "COMMISSIONS",
    entries: [
      { year: "2018", title: "Guest of Honor", detail: "Carnegie Museum of Art" },
      { year: "2018", title: "#ShowUpMF", detail: "Mattress Factory" },
    ],
  },
  {
    label: "RESIDENCIES & FELLOWSHIPS",
    entries: [
      { year: "2020–21", title: "FINE Residency", detail: "Children’s Museum of Pittsburgh" },
      { year: "2020", title: "Field Work Gallery" },
      {
        year: "2019",
        title: "Creative and Social Impact Fellow",
        detail: "Kelly Strayhorn Theater",
      },
      { year: "2019", title: "Distillery", detail: "Brew House Association" },
      { year: "2019", title: "Visiting Artist", detail: "Legacy Arts Project" },
      { year: "2018", title: "Bunker Projects" },
    ],
  },
  {
    label: "PUBLISHED WORK",
    entries: [
      { year: "2020", title: "Worst Title Ever", detail: "Cover Artist · Aaron Jones" },
      { year: "2018", title: "Cali Cod", detail: "Photo Editor · The Tenth Magazine" },
      { year: "2017", title: "Hidden Flame", detail: "Editorial Photographer · NeuNeu Magazine" },
      { year: "2017", title: "Wonderland", detail: "Editorial Photographer · Fucking Young" },
    ],
  },
  {
    label: "PERFORMANCES",
    entries: [
      { year: "2019", title: "Stone Wall: 50th Anniversary", detail: "Andy Warhol Museum" },
      {
        year: "2018",
        title: "The Warhol Shop Talk: Black Joy, Masculinity, & Barbershops",
        detail: "Andy Warhol Museum",
      },
      { year: "2018", title: "My People Queer Art", detail: "KST Alloy" },
    ],
  },
  {
    label: "WORKSHOPS",
    entries: [
      {
        year: "2026",
        title:
          "Making AI Make Sense Together: Designing a Critical AI Research Commons with NYC Open Data",
        detail: "School of Data: Data Week",
      },
    ],
  },
  {
    label: "PUBLIC SPEAKING",
    entries: [
      { year: "2025", title: "Queer Tech Stories Across Generations", detail: "PayPal HQ" },
      { year: "2025", title: "Building Products in the Age of AI", detail: "Hearst" },
      {
        year: "2024",
        title: "Speculative: Designing for the day after tomorrow",
        detail: "Hearst",
      },
      { year: "2021", title: "Designing Technology", detail: "Bloom Institute of Technology" },
      { year: "2019", title: "1440 Artist Panel", detail: "Mattress Factory" },
      { year: "2018", title: "Visiting Photography Critic", detail: "Point Park University" },
      {
        year: "2018",
        title: "The Illusion Of The Queer Black American",
        detail: "Artist Image Resource",
      },
    ],
  },
  {
    label: "COMMITTEES",
    entries: [
      { title: "Out in Tech", detail: "Pittsburgh Leadership" },
      { title: "Hearst UX Guild", detail: "Founding Member" },
    ],
  },
  {
    label: "SELECT PROFESSIONAL EXPERIENCE",
    entries: [
      {
        title: "Hearst Television · Technical Product Manager",
        detail: "Emerging Technology — AI, rapid prototyping, research",
      },
      {
        title: "Candid · Product Manager",
        detail: "API — Apple Pay API, GraphQL API, Demographics API",
      },
    ],
  },
  {
    label: "EDUCATION",
    entries: [
      {
        year: "2023",
        title: "B.S. Information Assurance and Security",
        detail: "American Intercontinental University",
      },
      {
        year: "2021",
        title: "Certificate, Web Development and Computer Science",
        detail: "Bloom Institute of Technology",
      },
    ],
  },
  {
    label: "MEDIA & PRESS",
    entries: [
      {
        year: "2025",
        title:
          "Showing Up: Brendon Hawkins on Art, Technology, and Community Accountability",
        detail: "Syncing Up Podcast · Out in Tech",
      },
      {
        year: "2020",
        title:
          "MuseumLab opens line of communication with Channel group art exhibition",
        detail: "Pittsburgh City Paper · Amanda Waltz",
      },
      {
        year: "2019",
        title:
          "LGBTQ+ artists assert their identities for The Self, Realized: Queering the Art of Self-Portraiture",
        detail: "Pittsburgh City Paper · Amanda Waltz",
      },
      {
        year: "2018",
        title: "Five stand-out stars from new all-black fashion mag Neu Neu",
        detail: "Dazed Magazine · Kemi Alemoru",
      },
    ],
  },
];

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
            Studio Lab BH is a systems research lab modeling invisible human
            systems, with affect as its first field of study. The studio is
            also the research practice of Brendon Hawkins, whose work moves
            across art, computation, product, and social theory.
          </p>
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

        {/* Method */}
        <div className="container-page st-method-heading">
          <h3 className="t-h3">METHOD</h3>
        </div>

        {/* Method tenets */}
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
      </section>

      {/* ── §10.4 Section B — Brendon ── */}
      <section id="brendon" aria-labelledby="section-b-heading">
        <div className="hairline-t hairline-b st-section-bar">
          <span className="t-mono" style={{ opacity: 0.55 }}>
            SECTION B
          </span>
          <span id="section-b-heading" className="st-section-title">
            BRENDON HAWKINS / FOUNDER
          </span>
          <span className="st-section-avatar" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/studio/brendon-portrait.png"
                alt="Brendon Hawkins"
                className="st-intro-portrait-img"
              />
            </div>
          </div>
          <div className="st-intro-bio">
            <p className="t-body st-intro-para">
              Brendon Hawkins is the founder of Studio Lab BH and Interim
              Founding Board Chair at PIT Lab at CUNY. His work builds
              computational frameworks for affect: how emotion behaves as a
              structured system across populations, platforms, environments,
              and time.
            </p>
            <p className="t-body st-intro-para">
              His practice is interdisciplinary by design. He trained as an
              artist and works as a technologist, with a background spanning
              art, research, product, and emerging technologies. Prior work
              centered on time, identity, language, and culture as systems;
              current work formalizes affect as a missing layer in how we
              model human experience.
            </p>
            <p className="t-body st-intro-para">
              Based in New York. Formative roots in Pittsburgh. Studies ASL.
              Reads widely.
            </p>
          </div>
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

        {/* Curriculum Vitae */}
        <details className="container-page st-cv">
          <summary className="t-h3 st-cv-header">
            <span>CURRICULUM VITAE</span>
            <span className="t-mono st-cv-toggle">OPEN ARCHIVE</span>
          </summary>
          <div className="st-cv-archive">
            {CV.map((category) => (
              <section key={category.label} className="st-cv-category">
                <h4 className="t-label st-cv-category-label">{category.label}</h4>
                <ul className="st-cv-list">
                  {category.entries.map((entry, i) => (
                    <li key={`${category.label}-${i}`} className="st-cv-row">
                      <span className="t-mono st-cv-year">{entry.year ?? ""}</span>
                      <div className="st-cv-content">
                        <span className="st-cv-title">{entry.title}</span>
                        {entry.detail && (
                          <span className="st-cv-detail">{entry.detail}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </details>

        {/* Contact */}
        <div className="container-page st-contact">
          <h3 className="t-h3 st-contact-header">CONTACT</h3>
          <ul className="st-contact-list">
            <li className="st-contact-row">
              <span className="t-label st-contact-label">EMAIL</span>
              <a
                href="mailto:brendon@studiolabbh.xyz"
                className="t-mono st-contact-value link-quiet"
              >
                brendon@studiolabbh.xyz
              </a>
            </li>
            <li className="st-contact-row">
              <span className="t-label st-contact-label">INSTAGRAM</span>
              <a
                href="https://instagram.com/studiolabbh"
                target="_blank"
                rel="noopener noreferrer"
                className="t-mono st-contact-value link-quiet"
              >
                @studiolabbh ↗︎
              </a>
            </li>
          </ul>
        </div>
      </section>

      <style>{`
        /* ── §10.1 Header ── */
        .st-header {
          position: relative;
        }
        .st-header-inner {
          padding-top: 56px;
          padding-bottom: 64px;
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
          font-family: var(--font-inter), sans-serif;
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

        /* ── §10.3 Method ── */
        .st-method-heading {
          padding-top: 0;
          padding-bottom: 32px;
        }
        .st-method-heading h3 { margin: 0; opacity: 0.72; }

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
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 48px;
          line-height: 1;
          opacity: 0.35;
        }
        .st-tenet-title {
          font-family: var(--font-inter), sans-serif;
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

        /* ── §10.4 Curriculum Vitae ── */
        .st-cv {
          padding-top: 0;
          padding-bottom: 96px;
        }
        .st-cv-header {
          margin: 0;
          padding: 24px 0;
          opacity: 0.72;
          border-top: 0.5px solid var(--hairline);
          border-bottom: 0.5px solid var(--hairline);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          list-style: none;
        }
        .st-cv-header::-webkit-details-marker { display: none; }
        .st-cv-toggle { font-size: 10px; }
        .st-cv[open] .st-cv-toggle::after { content: " / CLOSE"; }
        .st-cv-archive { padding-top: 48px; }
        .st-cv-category {
          margin-bottom: 56px;
        }
        .st-cv-category:last-child {
          margin-bottom: 0;
        }
        .st-cv-category-label {
          margin: 0 0 20px;
          font-size: 11px;
          letter-spacing: 0.18em;
          opacity: 0.72;
        }
        .st-cv-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .st-cv-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4px;
          padding: 16px 0;
          border-top: 0.5px solid var(--hairline);
        }
        @media (min-width: 720px) {
          .st-cv-row {
            grid-template-columns: 80px 1fr;
            gap: 24px;
            align-items: baseline;
          }
        }
        .st-cv-list li:last-child {
          border-bottom: 0.5px solid var(--hairline);
        }
        .st-cv-year {
          font-size: 11px;
          opacity: 0.72;
        }
        .st-cv-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .st-cv-title {
          font-family: var(--font-inter), sans-serif;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.4;
          color: var(--ground);
        }
        .st-cv-detail {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 13px;
          line-height: 1.4;
          opacity: 0.6;
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
