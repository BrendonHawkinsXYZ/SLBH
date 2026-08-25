import { ChromaLegal, chromaLegalStyles as styles } from "@/components/chroma/ChromaLegal";

export const metadata = {
  title: "Chroma Privacy Policy — SLBH",
  description:
    "How Chroma keeps notes, voice recordings, emotions, colors, readings, and reflections in local storage on your iPhone.",
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "August 25, 2026";

export default function ChromaPrivacyPage() {
  return (
    <ChromaLegal
      title="Privacy Policy"
      documentName="Privacy"
      effectiveDate={EFFECTIVE_DATE}
      signals="ON-DEVICE · NO ACCOUNT · NO JOURNAL CLOUD"
      intro={
        <p className={styles.paragraph}>
          Chroma is provided by Studio Lab BH, LLC (“Studio Lab BH,” “we,” “us,”
          or “our”). Chroma does not require an account and is designed so your
          journal content remains in local app storage on your iPhone.
        </p>
      }
      sections={[
        {
          title: "The short version",
          content: (
            <>
              <p className={styles.paragraph}>
                Chroma has no journal server or journal cloud. Your notes, voice
                recordings, transcripts, emotions, colors, visual forms, readings,
                tags, goals, and reflections are not sent to Studio Lab BH.
              </p>
              <p className={styles.paragraph}>
                We do not sell your personal information, use your journal for
                advertising, or track you across other companies’ apps or websites.
              </p>
            </>
          ),
        },
        {
          title: "Information processed on your iPhone",
          content: (
            <>
              <p className={styles.paragraph}>Chroma may process information you choose to create, including:</p>
              <ul className={styles.list}>
                {[
                  "Typed notes, voice recordings, and editable transcripts",
                  "Named emotions, mood-field selections, and context tags",
                  "Three-color palettes and generated visual forms",
                  "Daily readings, Lean and Leave guidance, and reflection questions",
                  "Weekly reflections and excerpts selected from your own words",
                  "Search filters, reminder preferences, reflection goals, and app settings",
                ].map((item) => <li key={item} className={styles.listItem}>{item}</li>)}
              </ul>
              <p className={styles.paragraph}>
                This information is processed and stored locally. Chroma does not
                upload it to a Studio Lab BH server.
              </p>
            </>
          ),
        },
        {
          title: "Voice recording and transcription",
          content: (
            <>
              <p className={styles.paragraph}>
                Voice notes remain playable in Chroma. When your iPhone supports
                local transcription, transcription happens on the device.
              </p>
              <p className={styles.paragraph}>
                If local transcription is unavailable, Chroma keeps the voice note
                without sending the recording to another transcription service.
              </p>
            </>
          ),
        },
        {
          title: "Readings and Weekly Chroma",
          content: (
            <>
              <p className={styles.paragraph}>
                Chroma creates daily readings and, after at least three recorded
                moments, may create a weekly reflection showing what repeated or changed.
              </p>
              <p className={styles.paragraph}>
                Weekly Chroma depends on Apple’s supported on-device intelligence
                model and may not be available on every iPhone. Eligible journal
                material is processed on the device and is not sent to a Chroma server.
              </p>
            </>
          ),
        },
        {
          title: "No account, cloud, or cross-device recovery",
          content: (
            <>
              <p className={styles.paragraph}>
                Chroma works without an internet connection. It does not provide a
                Chroma account, web journal, cloud sync, or cross-device recovery.
              </p>
              <p className={styles.paragraph}>
                Device loss, app deletion, or data removal may permanently remove
                your journal. Apple device backups, when enabled by you, are controlled
                through your Apple account and device settings.
              </p>
            </>
          ),
        },
        {
          title: "Memberships and purchases",
          content: (
            <>
              <p className={styles.paragraph}>
                Chroma may offer monthly, yearly, and lifetime membership options.
                Apple processes purchases and manages billing through the App Store.
                Chroma reads the verified entitlement needed to unlock purchased access.
              </p>
              <p className={styles.paragraph}>
                Studio Lab BH does not receive or store your payment-card information.
                Apple’s handling of App Store activity is described in its{" "}
                <a className={styles.link} href="https://www.apple.com/legal/privacy/data/en/appstore/" target="_blank" rel="noopener noreferrer">App Store &amp; Privacy notice</a>.
              </p>
            </>
          ),
        },
        {
          title: "Analytics and tracking",
          content: (
            <>
              <p className={styles.paragraph}>
                Chroma does not use third-party advertising or behavioral-analytics
                SDKs, cross-app tracking, or the Apple advertising identifier.
              </p>
              <p className={styles.paragraph}>
                Apple may provide Studio Lab BH with App Store purchase and product
                reporting that does not include your Chroma journal content.
              </p>
            </>
          ),
        },
        {
          title: "Notifications",
          content: (
            <p className={styles.paragraph}>
              If you grant notification permission, Chroma schedules the morning,
              daytime, or evening reminders you configure using iOS notification
              services. You can change reminders in Chroma or revoke permission in iOS Settings.
            </p>
          ),
        },
        {
          title: "Information you choose to share",
          content: (
            <p className={styles.paragraph}>
              Chroma can create shareable reading artwork. Nothing is shared unless
              you initiate the iOS sharing flow and choose a destination. Once shared,
              that destination’s privacy practices apply.
            </p>
          ),
        },
        {
          title: "Retention and deletion",
          content: (
            <>
              <p className={styles.paragraph}>
                Your Chroma history remains locally on your iPhone until you delete
                it or uninstall the app. Studio Lab BH does not keep a remote journal
                archive to retrieve or delete on your behalf.
              </p>
              <p className={styles.paragraph}>
                Copies may remain in an Apple device backup if your backup settings
                include Chroma. You control those backups through Apple.
              </p>
            </>
          ),
        },
        {
          title: "Children’s privacy",
          content: (
            <p className={styles.paragraph}>
              Chroma is not directed to children under 13, and Studio Lab BH does
              not knowingly collect journal content from children.
            </p>
          ),
        },
        {
          title: "Security",
          content: (
            <p className={styles.paragraph}>
              Chroma relies on iOS, your device passcode or biometrics, and Apple’s
              data-protection technologies. You are responsible for maintaining the
              security of your iPhone and Apple account.
            </p>
          ),
        },
        {
          title: "Changes to this policy",
          content: (
            <p className={styles.paragraph}>
              We may update this policy when Chroma’s features or data practices
              change. The effective date above identifies the current version. We
              will update this policy and applicable App Store disclosures before
              introducing materially different data practices.
            </p>
          ),
        },
        {
          title: "Contact",
          content: (
            <p className={styles.paragraph}>
              Studio Lab BH, LLC<br />
              <a className={styles.link} href="mailto:brendon@studiolabbh.xyz">brendon@studiolabbh.xyz</a>
            </p>
          ),
        },
      ]}
    />
  );
}
