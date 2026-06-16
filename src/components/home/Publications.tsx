"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DURATIONS, EASE_OUT } from "@/lib/motion";

type Publication = {
  date: string;
  title: string;
  status: "PREPRINT" | "PUBLISHED" | "WORKING";
  venue: string;
  href: string;
};

const PUBLICATIONS: Publication[] = [
  {
    date: "2026.02",
    title:
      "Emotion as System: A Foundational Architecture for Affect, Meaning, Perception, and Action",
    status: "PREPRINT",
    venue: "arXiv",
    href: "/research/emotion-as-system",
  },
];

const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Publications() {
  return (
    <section
      className="hairline-t hairline-b pub-section"
    >
      <div className="container-page">
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={REVEAL_VARIANTS}
          transition={{ duration: DURATIONS.base, ease: EASE_OUT }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 48,
          }}
        >
          <p className="t-mono" style={{ opacity: 0.55, margin: 0 }}>
            05 / PUBLICATIONS
          </p>
          <Link
            href="/research"
            className="t-label link-quiet"
            style={{
              color: "var(--ground)",
              textDecoration: "underline",
              textUnderlineOffset: 4,
              letterSpacing: "0.18em",
            }}
          >
            See all ↗︎
          </Link>
        </motion.header>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PUBLICATIONS.map((p, i) => (
            <motion.li
              key={p.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={REVEAL_VARIANTS}
              transition={{
                duration: DURATIONS.base,
                ease: EASE_OUT,
                delay: i * 0.05,
              }}
              className="pub-row"
            >
              <Link href={p.href} className="pub-link">
                <span className="pub-date t-mono">{p.date}</span>
                <span className="pub-title">{p.title}</span>
                <span className="pub-status t-label">{p.status}</span>
                <span className="pub-venue t-mono">{p.venue}</span>
              </Link>
            </motion.li>
          ))}
        </ul>

        <style>{`
          .pub-row {
            border-top: 0.5px solid var(--hairline);
          }
          .pub-row:last-child {
            border-bottom: 0.5px solid var(--hairline);
          }
          .pub-link {
            display: grid;
            grid-template-columns: 80px 1fr 120px 80px;
            gap: 24px;
            align-items: center;
            padding: 20px 0;
            text-decoration: none;
            color: var(--ground);
          }
          .pub-link > *:not(.pub-title) {
            transition: opacity var(--d-fast) var(--ease-out);
          }
          .pub-link:hover > *:not(.pub-title) {
            opacity: 0.55;
          }
          .pub-section { padding-top: 56px; padding-bottom: 56px; }
          @media (min-width: 768px) { .pub-section { padding-top: 80px; padding-bottom: 80px; } }
          .pub-date { opacity: 0.72; font-size: 11px; }
          .pub-title {
            font-family: var(--font-inter), sans-serif;
            font-weight: 500;
            font-size: clamp(14px, 2vw, 20px);
            letter-spacing: 0;
            line-height: 1.25;
          }
          .pub-status {
            justify-self: start;
            border: 1px solid var(--hairline-strong);
            padding: 6px 12px;
            letter-spacing: 0.14em;
            font-size: 10px;
          }
          .pub-venue { opacity: 0.72; font-size: 11px; text-align: right; }
          @media (max-width: 720px) {
            .pub-link {
              grid-template-columns: 1fr auto;
              gap: 8px;
            }
            .pub-link .pub-title { grid-column: 1 / -1; order: 1; font-size: 15px; }
            .pub-link .pub-date  { order: 2; }
            .pub-link .pub-status{ order: 3; justify-self: end; }
            .pub-link .pub-venue { order: 4; grid-column: 1 / -1; text-align: left; }
          }
        `}</style>
      </div>
    </section>
  );
}
