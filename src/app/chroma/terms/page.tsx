import { ChromaLegal, chromaLegalStyles as styles } from "@/components/chroma/ChromaLegal";

export const metadata = {
  title: "Chroma Terms of Use — SLBH",
  description: "Terms governing access to and use of the Chroma iPhone app.",
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "August 25, 2026";

export default function ChromaTermsPage() {
  return (
    <ChromaLegal
      title="Terms of Use"
      documentName="Terms"
      effectiveDate={EFFECTIVE_DATE}
      signals="IPHONE · LOCAL STORAGE · APP STORE"
      intro={
        <p className={styles.paragraph}>
          These Terms govern your use of Chroma, an iPhone app provided by Studio
          Lab BH, LLC (“Studio Lab BH,” “we,” “us,” or “our”). By downloading or
          using Chroma, you agree to these Terms and Apple’s Standard EULA.
        </p>
      }
      sections={[
        {
          title: "What Chroma is",
          content: (
            <p className={styles.paragraph}>
              Chroma is a private emotional journal. It lets you record a moment,
              locate an emotion, choose colors, create a visual form, and receive
              daily or weekly reflections based on information stored on your iPhone.
            </p>
          ),
        },
        {
          title: "Not medical care",
          content: (
            <p className={styles.paragraph}>
              Chroma is not therapy, medical care, diagnosis, crisis support, or a
              substitute for a qualified professional. Readings and prompts are for
              personal reflection only. If you may be in danger or need urgent help,
              contact local emergency services or an appropriate crisis resource.
            </p>
          ),
        },
        {
          title: "Eligibility",
          content: (
            <p className={styles.paragraph}>
              You must be at least 13 years old and legally able to agree to these
              Terms. If the law where you live requires a higher age, that higher age applies.
            </p>
          ),
        },
        {
          title: "License",
          content: (
            <>
              <p className={styles.paragraph}>
                Chroma is licensed, not sold. Your license is personal, limited,
                revocable, non-exclusive, and non-transferable, subject to these
                Terms and Apple’s{" "}
                <a className={styles.link} href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer">Standard Licensed Application End User License Agreement</a>.
              </p>
              <p className={styles.paragraph}>
                You may use Chroma only on Apple devices you own or control and as
                permitted by Apple’s usage rules.
              </p>
            </>
          ),
        },
        {
          title: "Your journal and local storage",
          content: (
            <>
              <p className={styles.paragraph}>
                You retain responsibility for the words, recordings, colors, tags,
                and other material you create in Chroma. Chroma stores journal
                material locally and does not provide a Chroma account, journal cloud,
                web access, sync, or cross-device recovery.
              </p>
              <p className={styles.paragraph}>
                You are responsible for your device security and any Apple backup
                settings you choose. Studio Lab BH cannot recover a journal lost
                through device loss, app deletion, data deletion, or backup failure.
              </p>
            </>
          ),
        },
        {
          title: "On-device features and availability",
          content: (
            <p className={styles.paragraph}>
              Some features depend on iPhone hardware, iOS permissions, language,
              region, or Apple’s supported on-device models. Voice transcription and
              Weekly Chroma may not be available or operate identically on every
              iPhone. We may improve, modify, suspend, or discontinue features over time.
            </p>
          ),
        },
        {
          title: "Memberships and purchases",
          content: (
            <>
              <p className={styles.paragraph}>
                Chroma may offer monthly, yearly, and lifetime membership options.
                Available products, prices, billing periods, renewal terms, and any
                trial terms are shown by Apple before purchase.
              </p>
              <p className={styles.paragraph}>
                Apple processes payment, billing, renewal, cancellation, and refund
                requests under the applicable App Store terms. You can manage eligible
                subscriptions through your{" "}
                <a className={styles.link} href="https://apps.apple.com/account/subscriptions" target="_blank" rel="noopener noreferrer">Apple subscription settings</a>.
                Chroma reads Apple’s verified entitlement to determine access.
              </p>
            </>
          ),
        },
        {
          title: "Acceptable use",
          content: (
            <p className={styles.paragraph}>
              You may not misuse Chroma, interfere with its operation, attempt to
              bypass purchase or security controls, reverse engineer it except where
              applicable law expressly permits, or use it in violation of law or
              another person’s rights.
            </p>
          ),
        },
        {
          title: "Studio Lab BH rights",
          content: (
            <p className={styles.paragraph}>
              Chroma, its visual system, software, branding, prompts, and other
              materials are owned by Studio Lab BH or its licensors and are protected
              by intellectual-property law. These Terms do not transfer ownership to you.
            </p>
          ),
        },
        {
          title: "Third-party services",
          content: (
            <p className={styles.paragraph}>
              Chroma relies on Apple services for distribution, purchases, device
              capabilities, notifications, and optional sharing. Your use of those
              services is governed by Apple’s terms and privacy notices. A destination
              you select through the iOS share sheet is governed by that destination’s terms.
            </p>
          ),
        },
        {
          title: "Disclaimers and liability",
          content: (
            <>
              <p className={styles.paragraph}>
                Chroma is provided on an “as is” and “as available” basis to the
                maximum extent permitted by law. Reflections may be incomplete,
                unavailable, or not useful for your circumstances, and you remain
                responsible for decisions you make.
              </p>
              <p className={styles.paragraph}>
                The warranty and liability provisions in Apple’s Standard EULA apply.
                Nothing in these Terms excludes rights or remedies that cannot be
                excluded under applicable consumer law.
              </p>
            </>
          ),
        },
        {
          title: "Termination",
          content: (
            <p className={styles.paragraph}>
              You may stop using Chroma at any time. Your license may end if you
              materially violate these Terms. Sections that by their nature should
              survive termination—including ownership, disclaimers, and limitations—will survive.
            </p>
          ),
        },
        {
          title: "Changes to these Terms",
          content: (
            <p className={styles.paragraph}>
              We may update these Terms as Chroma changes. The effective date above
              identifies the current version. Continued use after an update means you
              accept the revised Terms to the extent permitted by law.
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
