import Link from "next/link";
import { ChromaHero } from "@/components/home/ChromaHero";
import { ChromaSignupForm } from "@/components/home/ChromaSignupForm";
import { FallbackImg } from "@/components/projects/FallbackImg";

type ChromaLandingProps = {
  screens: string[];
};

const CHAPTERS = [
  {
    title: "YOUR FEELINGS, REMEMBERED.",
    body: "Chroma is a personal instrument for recording how you feel and giving each feeling a visual form. A moment becomes something you can return to, not another note you lose in a list.",
  },
  {
    title: "GIVE FEELING A FORM.",
    body: "Choose the shape, color, and intensity that fit the moment. Chroma keeps the act of recording light while preserving enough structure for patterns to become visible over time.",
  },
  {
    title: "AN ARCHIVE OF HOW YOU’VE FELT.",
    body: "Each entry joins a living visual archive. What felt isolated begins to sit beside what came before it — an emotional record built in your own visual language.",
  },
  {
    title: "SEE WHAT CHROMA NOTICED.",
    body: "Chroma looks across the forms you have made to surface repetition, movement, and change. It does not tell you what to feel. It helps you notice what was already there.",
  },
  {
    title: "RESEARCH-BACKED. PRIVATE BY DESIGN.",
    body: "Built from Studio Lab BH’s research into emotion as a structured system, Chroma is designed for private reflection. The research lives inside the instrument, not above it.",
  },
] as const;

export function ChromaLanding({ screens }: ChromaLandingProps) {
  return (
    <div className="chroma-landing">
      <ChromaHero />

      <div className="chroma-story">
        {CHAPTERS.map((chapter, index) => {
          const src = screens[index] ?? "";
          return (
            <section
              key={chapter.title}
              className={`chroma-chapter ${index % 2 === 1 ? "chroma-chapter--reverse" : ""}`}
              aria-labelledby={`chroma-chapter-${index + 1}`}
            >
              <div className="chroma-chapter-inner">
                <div className="chroma-chapter-copy">
                  <h2 id={`chroma-chapter-${index + 1}`} className="chroma-chapter-title">
                    {chapter.title}
                  </h2>
                  <p className="chroma-chapter-body">{chapter.body}</p>
                  {index === 4 && (
                    <Link href="/research/emotion-as-system" className="chroma-paper-link">
                      READ THE FOUNDATIONAL PAPER ↗︎
                    </Link>
                  )}
                </div>

                <figure className="chroma-screen-figure">
                  <div className="chroma-screen-shell">
                    <div className="chroma-screen-ground" aria-hidden />
                    {src && (
                      <FallbackImg
                        src={src}
                        alt={`Chroma product screen ${index + 1}: ${chapter.title}`}
                        className="chroma-screen-image"
                      />
                    )}
                  </div>
                  <figcaption className="chroma-screen-caption">
                    <span>CHROMA / SCREEN {String(index + 1).padStart(2, "0")}</span>
                    <span>IOS / 2026</span>
                  </figcaption>
                </figure>
              </div>
            </section>
          );
        })}

        <section className="chroma-meet" aria-labelledby="chroma-meet-title">
          <div className="chroma-meet-inner">
            <p className="chroma-meet-kicker">CHROMA — AN INSTRUMENT BY STUDIO LAB BH</p>
            <h2 id="chroma-meet-title" className="chroma-meet-title">MEET CHROMA</h2>
            <p className="chroma-meet-date">COMING SEPTEMBER 2026</p>
            <ChromaSignupForm />
          </div>
        </section>
      </div>

      <style>{`
        .chroma-landing {
          width: 100%;
          background: #1c1c1e;
          color: var(--signal);
        }
        .chroma-story { background: #1c1c1e; }
        .chroma-chapter {
          min-height: 100svh;
          display: flex;
          align-items: center;
          border-top: 1px solid rgba(245, 245, 243, 0.12);
          background: #1c1c1e;
        }
        .chroma-chapter-inner {
          width: 100%;
          max-width: var(--max-w);
          margin-inline: auto;
          padding: 96px var(--pad-x-mobile);
          display: grid;
          grid-template-columns: 1fr;
          gap: 64px;
          align-items: center;
        }
        .chroma-chapter-copy { max-width: 620px; }
        .chroma-screen-caption,
        .chroma-meet-kicker {
          font-family: var(--font-plex-mono), monospace;
          font-size: 9.5px;
          line-height: 1.4;
          letter-spacing: 0.16em;
          color: rgba(245, 245, 243, 0.52);
        }
        .chroma-chapter-title {
          margin: 0;
          max-width: 13ch;
          font-family: var(--font-orbitron), sans-serif;
          font-size: clamp(34px, 5.2vw, 76px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.02em;
          text-wrap: balance;
        }
        .chroma-chapter-body {
          max-width: 520px;
          margin: 32px 0 0;
          font-family: var(--font-inter), sans-serif;
          font-size: clamp(16px, 1.5vw, 19px);
          font-weight: 300;
          line-height: 1.65;
          color: rgba(245, 245, 243, 0.72);
        }
        .chroma-paper-link {
          display: inline-block;
          margin-top: 32px;
          color: var(--signal);
          font-family: var(--font-inter), sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-underline-offset: 5px;
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .chroma-paper-link:hover { opacity: 0.58; }
        .chroma-screen-figure {
          width: min(100%, 360px);
          margin: 0 auto;
        }
        .chroma-screen-shell {
          position: relative;
          aspect-ratio: 9 / 19.5;
          overflow: hidden;
          border: 1px solid rgba(245, 245, 243, 0.22);
          border-radius: 42px;
          background: #0b0b0c;
          box-shadow: 0 42px 100px rgba(0, 0, 0, 0.62);
        }
        .chroma-screen-ground {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 30%, rgba(168, 95, 247, 0.09), transparent 45%),
            #080809;
        }
        .chroma-screen-image {
          position: absolute;
          inset: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .chroma-screen-caption {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 16px;
        }
        .chroma-meet {
          min-height: 92svh;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid rgba(245, 245, 243, 0.12);
          background: #1c1c1e;
          text-align: center;
        }
        .chroma-meet-inner {
          width: 100%;
          max-width: 1000px;
          padding: 120px var(--pad-x-mobile);
        }
        .chroma-meet-kicker { margin: 0 0 36px; }
        .chroma-meet-title {
          margin: 0;
          font-family: var(--font-orbitron), sans-serif;
          font-size: clamp(52px, 10vw, 142px);
          font-weight: 700;
          line-height: 0.92;
          letter-spacing: -0.03em;
        }
        .chroma-meet-date {
          margin: 32px 0 0;
          font-family: var(--font-inter), sans-serif;
          font-size: clamp(16px, 2vw, 24px);
          font-weight: 500;
          letter-spacing: 0.12em;
        }
        @media (min-width: 768px) {
          .chroma-chapter-inner {
            grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
            gap: 80px;
            padding: 120px var(--pad-x);
          }
          .chroma-chapter--reverse .chroma-chapter-copy { order: 2; justify-self: end; }
          .chroma-chapter--reverse .chroma-screen-figure { order: 1; }
          .chroma-meet-inner { padding-inline: var(--pad-x); }
        }
        @media (max-width: 767px) {
          .chroma-screen-figure { width: min(82vw, 320px); }
          .chroma-chapter { min-height: auto; }
        }
        @media (prefers-reduced-motion: reduce) {
          .chroma-paper-link { transition: none; }
        }
      `}</style>
    </div>
  );
}
