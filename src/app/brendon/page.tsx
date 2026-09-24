import Image from "next/image";
import Link from "next/link";
import styles from "../studio/studio.module.css";

export const metadata = {
  title: "Brendon Hawkins — SLBH",
  description:
    "Brendon Hawkins is a systems theorist, researcher, artist, and product leader; founder of Studio Lab BH and Founding Advisory Board Chair of the CUNY Public Interest Technology Lab.",
};

const AFFILIATIONS = [
  { role: "FOUNDER", org: "Studio Lab BH" },
  {
    role: "FOUNDING ADVISORY BOARD CHAIR",
    org: "CUNY Public Interest Technology Lab",
  },
];

type CVEntry = { year?: string; title: string; detail?: string };
type CVCategory = { label: string; entries: CVEntry[] };

const CV: CVCategory[] = [
  {
    label: "RESIDENCIES & FELLOWSHIPS",
    entries: [
      {
        year: "2026",
        title: "Public Interest Technology Research Fellow",
        detail: "CUNY, New York, NY",
      },
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
    label: "WORKSHOPS",
    entries: [
      {
        year: "2026",
        title: "Tell Me How You Feel: Chroma",
        detail: "Plated Studios",
      },
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
      {
        year: "2026",
        title: "Queer Tech Stories Across Generations",
        detail: "Out in Tech Leadership Institute",
      },
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
    label: "SOLO EXHIBITIONS",
    entries: [
      { year: "2026", title: "Tell Me How You Feel: ACG", detail: "The Space, New York, NY" },
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

function readableHeading(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/\bdna\b/g, "DNA");
}

export default function BrendonPage() {
  return (
    <article className={`container-page ${styles.page}`}>
      <div className={styles.document}>
        <header className={styles.header}>
          <h1>Brendon Hawkins</h1>
          <p className={styles.meta}>Founder</p>
          <figure className={styles.portrait}>
            <Image
              src="/studio/brendon-portrait.png"
              alt="Brendon Hawkins speaking into a microphone."
              width={800}
              height={1000}
              sizes="(max-width: 480px) calc(100vw - 44px), 340px"
            />
          </figure>
          <p>
            Brendon Hawkins is a systems theorist, researcher, artist, and product
            leader. He is the founder of <Link href="/studio" className={styles.bioLink}>Studio Lab BH</Link> and{" "}
            <a className={styles.bioLink} href="https://nycpitpopup.org/cuny-pit-lab-to-name-brendon-hawkins-as-founding-advisory-board-chair/" target="_blank" rel="noopener noreferrer">Founding Advisory Board Chair</a> of the CUNY Public Interest Technology Lab.
          </p>
          <p>
            His practice examines how human experience, culture, and perception
            are translated into computational and representational systems. His
            work moves between research, software, visual art, and participatory
            environments.
          </p>
          <p>
            Product leadership at Hearst Television and Candid grounds this work
            in implementation: moving from emerging technology and prototypes to
            usable products, APIs, and systems.
          </p>
          <p>
            Based in New York. Formative roots in Pittsburgh. Studies ASL.
            Reads widely.
          </p>
        </header>

        <section className={styles.section} aria-labelledby="affiliations-heading">
          <h2 id="affiliations-heading">Current affiliations</h2>
          <dl className={styles.affiliations}>
            {AFFILIATIONS.map((affiliation) => (
              <div key={affiliation.role}>
                <dt>{readableHeading(affiliation.role)}</dt>
                <dd>{affiliation.org}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.affiliationNote}>
            The <a className={styles.bioLink} href="https://nycpitpopup.org/our-partners/" target="_blank" rel="noopener noreferrer">CUNY Public Interest Technology Lab</a> connects
            students, educators, and community partners around technology in the
            public interest. Its work includes critical AI literacy, civic data,
            open-source tools, and participatory design.
          </p>
        </section>

        <details className={styles.cv}>
          <summary>Curriculum vitae <span aria-hidden="true">+</span></summary>
          <div className={styles.archive}>
            {CV.map((category) => (
              <section key={category.label} className={styles.cvCategory}>
                <h3 className={styles.label}>{readableHeading(category.label)}</h3>
                <ul className={styles.cvList}>
                  {category.entries.map((entry, index) => (
                    <li key={`${category.label}-${index}`}>
                      {entry.year && <span className={styles.year}>{entry.year}</span>}
                      <div className={styles.cvEntry}>
                        <span>{entry.title}</span>
                        {entry.detail && <span className={styles.detail}>{entry.detail}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </details>

        <section className={styles.section} aria-labelledby="contact-heading">
          <h2 id="contact-heading">Contact</h2>
          <ul className={styles.contact}>
            <li><a href="mailto:brendon@studiolabbh.xyz">brendon@studiolabbh.xyz</a></li>
            <li>
              <a href="https://instagram.com/studiolabbh" target="_blank" rel="noopener noreferrer">
                Instagram / @studiolabbh ↗
              </a>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
