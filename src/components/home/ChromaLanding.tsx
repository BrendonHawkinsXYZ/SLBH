import Image from "next/image";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/mood-tracker-journal-chroma/id6784464340";

export function ChromaLanding() {
  return (
    <section className="chroma-direct" aria-labelledby="chroma-title">
      <div className="chroma-direct-inner">
        <div className="chroma-direct-copy">
          <h1 id="chroma-title">See your feelings take shape.</h1>
          <p>
            Speak or type what happened. Chroma turns the moment into color,
            form, and a private reflection—entirely on your iPhone.
          </p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="chroma-store-link"
          >
            View Chroma on the App Store <span aria-hidden>↗︎</span>
          </a>
        </div>

        <figure className="chroma-collection">
          <Image
            src="/chroma/collection.png"
            alt="Four Chroma app views showing voice journaling, a daily reading, a weekly reflection, and on-device privacy"
            width={6686}
            height={5376}
            priority
            sizes="(max-width: 767px) calc(100vw - 48px), 66vw"
          />
        </figure>
      </div>

      <style>{`
        .chroma-direct {
          flex: 1;
          min-height: calc(100svh - 138px);
          display: flex;
          align-items: stretch;
          width: 100%;
          overflow: hidden;
          background: var(--ground);
          color: var(--signal);
        }
        .chroma-direct-inner {
          width: 100%;
          max-width: var(--max-w);
          margin-inline: auto;
          padding: clamp(24px, 4.5vh, 48px) var(--pad-x);
          display: grid;
          grid-template-columns: minmax(270px, 0.72fr) minmax(0, 1.28fr);
          gap: clamp(36px, 5vw, 76px);
          align-items: center;
        }
        .chroma-direct-copy {
          position: relative;
          z-index: 1;
          max-width: 480px;
        }
        .chroma-direct h1 {
          margin: 0;
          max-width: 8.5ch;
          font-family: var(--font-inter), sans-serif;
          font-size: clamp(44px, 5.1vw, 72px);
          font-weight: 500;
          line-height: 0.98;
          letter-spacing: -0.045em;
          text-wrap: balance;
        }
        .chroma-direct-copy p {
          max-width: 420px;
          margin: clamp(22px, 3vh, 34px) 0 0;
          font-family: var(--font-inter), sans-serif;
          font-size: clamp(14px, 1.25vw, 17px);
          font-weight: 300;
          line-height: 1.55;
          color: rgba(245, 245, 243, 0.68);
        }
        .chroma-store-link {
          display: inline-block;
          margin-top: clamp(28px, 4vh, 44px);
          padding: 15px 20px;
          border: 1px solid rgba(245, 245, 243, 0.72);
          color: var(--signal);
          font-family: var(--font-inter), sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .chroma-store-link:hover { opacity: 0.58; }
        .chroma-collection {
          min-width: 0;
          min-height: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .chroma-collection img {
          width: 100%;
          height: auto;
          max-height: 100%;
          object-fit: contain;
          display: block;
        }
        @media (max-width: 767px) {
          .chroma-direct {
            min-height: calc(100svh - 166px);
          }
          .chroma-direct-inner {
            padding: 24px var(--pad-x-mobile) 20px;
            grid-template-columns: 1fr;
            grid-template-rows: auto minmax(0, 1fr);
            gap: 20px;
          }
          .chroma-direct-copy { max-width: 100%; }
          .chroma-direct h1 {
            max-width: 9ch;
            font-size: clamp(38px, 11.5vw, 52px);
          }
          .chroma-direct-copy p {
            max-width: 39ch;
            margin-top: 16px;
            font-size: 13px;
          }
          .chroma-store-link {
            margin-top: 20px;
            padding: 12px 15px;
            font-size: 9px;
          }
          .chroma-collection {
            align-items: flex-start;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .chroma-store-link { transition: none; }
        }
      `}</style>
    </section>
  );
}
