export const metadata = {
  title: "Chroma Privacy Policy — SLBH",
  description:
    "How Chroma handles your check-ins, notes, and readings: processed and stored on your device, never transmitted to Studio Lab BH.",
  // Public policy page for App Store submission — must stay indexable and
  // reachable without a login. (The sibling /chroma studio tool is noindex;
  // that metadata does not cascade here, but state the intent explicitly.)
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "August 14, 2026";

const PROCESSED = [
  "Daily check-ins and emotional selections",
  "Context selections and private notes",
  "Generated readings and Patterns",
  "Reminder preferences",
  "App settings and purchase-entitlement status",
];

export default function ChromaPrivacyPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="cp-hero">
        <div className="container-page cp-hero-inner">
          <p className="t-mono cp-kicker">CHROMA · PRIVACY POLICY</p>
          <h1 className="t-display cp-title">Privacy Policy</h1>
          <p className="cp-effective">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      {/* ── Readout strip ── */}
      <div className="hairline-t hairline-b cp-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / CHROMA / PRIVACY
        </span>
        <span
          className="t-label cp-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          ON-DEVICE · NO ACCOUNT · NO TRACKING
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          EFFECTIVE {EFFECTIVE_DATE.toUpperCase()}
        </span>
      </div>

      {/* ── Body ── */}
      <section className="container-page cp-body">
        <div className="cp-measure">
          <p className="t-body cp-para">
            Chroma is provided by Studio Lab BH, LLC (“Studio Lab BH,” “we,” “us,” or “our”).
            Chroma is designed to keep your personal reflections private and on your device.
          </p>

          <h2 className="t-h3 cp-h">The short version</h2>
          <p className="t-body cp-para">
            Your check-ins, emotional entries, private notes, patterns, and readings remain on
            your device. Chroma does not transmit this content to Studio Lab BH, an analytics
            provider, or an advertising network.
          </p>
          <p className="t-body cp-para">
            We do not sell your personal information, use it for advertising, or track you across
            other companies’ apps or websites.
          </p>

          <h2 className="t-h3 cp-h">Information processed by Chroma</h2>
          <p className="t-body cp-para">
            Chroma may process information that you choose to enter, including:
          </p>
          <ul className="cp-list">
            {PROCESSED.map((item) => (
              <li key={item} className="t-body cp-list-item">
                {item}
              </li>
            ))}
          </ul>
          <p className="t-body cp-para">
            This information is processed and stored locally on your device. Chroma does not
            require an account and does not upload this information to a Studio Lab BH server.
          </p>

          <h2 className="t-h3 cp-h">Analytics and tracking</h2>
          <p className="t-body cp-para">
            Chroma does not transmit product analytics or behavioral analytics.
          </p>
          <p className="t-body cp-para">
            Chroma does not use third-party advertising SDKs, analytics SDKs, cross-app tracking,
            or the Apple advertising identifier.
          </p>

          <h2 className="t-h3 cp-h">Pattern intelligence</h2>
          <p className="t-body cp-para">Pattern readings are assembled on your device.</p>
          <p className="t-body cp-para">
            When supported and available, Chroma may use Apple’s on-device Foundation Models to
            interpret eligible notes and generate portions of a reading. When that capability is
            unavailable, Chroma uses its deterministic reading engine.
          </p>
          <p className="t-body cp-para">
            Your notes and readings are not sent to a Chroma server through either process.
          </p>

          <h2 className="t-h3 cp-h">Purchases</h2>
          <p className="t-body cp-para">
            Chroma offers an optional, non-consumable in-app purchase called Chroma Full.
          </p>
          <p className="t-body cp-para">
            Purchases are processed by Apple through the App Store. Studio Lab BH does not receive
            or store your payment-card information. The app receives purchase and entitlement
            information from Apple’s StoreKit system so it can unlock purchased features.
          </p>
          <p className="t-body cp-para">
            Apple’s handling of purchase information is governed by Apple’s own privacy policy and
            App Store terms.
          </p>

          <h2 className="t-h3 cp-h">Notifications</h2>
          <p className="t-body cp-para">
            If you give Chroma permission to send notifications, the app schedules and manages the
            reminders you enable using Apple’s notification system.
          </p>
          <p className="t-body cp-para">
            Chroma does not transmit an analytics event when you open or complete a reminder. You
            can disable reminders in Chroma or revoke notification permission in iOS Settings.
          </p>

          <h2 className="t-h3 cp-h">Information you choose to share</h2>
          <p className="t-body cp-para">
            Chroma may allow you to export or share an artifact using the standard iOS sharing
            interface. Nothing is shared unless you initiate that action and select a destination.
          </p>
          <p className="t-body cp-para">
            Information you send to another app or service is then governed by that service’s
            privacy practices.
          </p>

          <h2 className="t-h3 cp-h">Data retention and deletion</h2>
          <p className="t-body cp-para">
            Your Chroma history remains locally on your device until you delete it or uninstall the
            app.
          </p>
          <p className="t-body cp-para">
            Deleting Chroma generally removes its locally stored information from that device.
            However, app data may remain in an Apple device backup if your backup settings include
            that information. Backups are controlled through your Apple account and device
            settings.
          </p>
          <p className="t-body cp-para">
            Because Studio Lab BH does not maintain a server-side copy of your Chroma history, we
            do not have a remote account or archive to delete on your behalf.
          </p>

          <h2 className="t-h3 cp-h">Children’s privacy</h2>
          <p className="t-body cp-para">
            Chroma is not directed to children under 13, and we do not knowingly collect personal
            information from children.
          </p>

          <h2 className="t-h3 cp-h">Data security</h2>
          <p className="t-body cp-para">
            Chroma relies on protections provided by iOS and your device, including device access
            controls and Apple’s data-protection technologies. You are responsible for maintaining
            appropriate security for your device and Apple account.
          </p>

          <h2 className="t-h3 cp-h">Changes to this policy</h2>
          <p className="t-body cp-para">
            We may update this Privacy Policy when Chroma’s features or data practices change. The
            effective date at the top of this page will identify the latest version.
          </p>
          <p className="t-body cp-para">
            If Chroma begins collecting or transmitting additional information in the future, we
            will update this policy and the app’s privacy disclosures before doing so.
          </p>

          <h2 className="t-h3 cp-h">Contact</h2>
          <p className="t-body cp-para">
            Questions about Chroma’s privacy practices can be sent to:
          </p>
          <p className="t-body cp-para">
            Studio Lab BH, LLC
            <br />
            <a href="mailto:brendon@studiolabbh.xyz" className="link-quiet cp-mail">
              brendon@studiolabbh.xyz
            </a>
          </p>
        </div>
      </section>

      <style>{`
        /* ── Hero ── */
        .cp-hero {
          min-height: 40vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .cp-hero-inner {
          padding-top: 80px;
          padding-bottom: 56px;
        }
        .cp-kicker {
          opacity: 0.55;
          margin: 0 0 24px;
        }
        .cp-title {
          margin: 0 0 28px;
          max-width: 18ch;
        }
        .cp-effective {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 18px;
          line-height: 1.4;
          opacity: 0.82;
          margin: 0;
        }
        @media (min-width: 768px) {
          .cp-effective { font-size: 20px; }
        }

        /* ── Readout strip ── */
        .cp-readout {
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
          .cp-readout { padding: 20px var(--pad-x); }
        }
        .cp-readout-mid { display: none; }
        @media (min-width: 1024px) {
          .cp-readout-mid { display: block; }
        }

        /* ── Body ── */
        .cp-body {
          padding-top: 80px;
          padding-bottom: 96px;
        }
        .cp-measure {
          max-width: 640px;
        }
        .cp-h {
          margin: 48px 0 16px;
        }
        .cp-measure > .cp-h:first-child { margin-top: 0; }
        .cp-para {
          margin: 0 0 18px;
          line-height: 1.7;
          opacity: 0.88;
        }
        .cp-list {
          margin: 0 0 18px;
          padding-left: 20px;
          list-style: none;
        }
        .cp-list-item {
          position: relative;
          margin: 0 0 10px;
          line-height: 1.7;
          opacity: 0.88;
        }
        .cp-list-item::before {
          content: "—";
          position: absolute;
          left: -20px;
          opacity: 0.45;
        }
        .cp-mail {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid var(--hairline-strong);
        }
      `}</style>
    </>
  );
}
