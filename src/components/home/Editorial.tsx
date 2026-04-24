"use client";

import { motion } from "motion/react";
import { DURATIONS, EASE_OUT } from "@/lib/motion";

const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Editorial() {
  return (
    <section
      className="container-page editorial-section"
    >
      <Block
        kicker="02 / THESIS"
        headline="Affect is the missing layer in how we model people."
        paragraphs={[
          "Current models treat emotion as a variable, a label, a moment. Studio Lab BH treats it as a system, a continuous structured field with its own geometry, dynamics, and rules.",
          "Our work formalizes that field. Not to replace feeling with math, but to make feeling legible at the scale of populations, platforms, and time.",
        ]}
        diagram={<AFEDiagram />}
        diagramSide="right"
      />

      <div style={{ height: 120 }} />

      <Block
        kicker="03 / METHOD"
        headline="We ship research like engineers ship software."
        paragraphs={[
          "Every model has a version. Every diagram has a citation. Every paper has a download, a reader, and a public trail.",
          "The lab runs as infrastructure. Outputs are instruments others can use, not prestige objects for us to point at.",
        ]}
        diagram={<VersionTimeline />}
        diagramSide="left"
      />
    </section>
  );
}

type BlockProps = {
  kicker: string;
  headline: string;
  paragraphs: string[];
  diagram: React.ReactNode;
  diagramSide: "left" | "right";
};

function Block({
  kicker,
  headline,
  paragraphs,
  diagram,
  diagramSide,
}: BlockProps) {
  const text = (
    <div style={{ maxWidth: 440 }}>
      <p className="t-mono" style={{ opacity: 0.55, marginBottom: 16 }}>
        {kicker}
      </p>
      <h2 className="t-h2" style={{ marginTop: 0, marginBottom: 32 }}>
        {headline}
      </h2>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="t-body"
          style={{
            opacity: 0.82,
            marginTop: i === 0 ? 0 : 16,
            fontSize: 16,
          }}
        >
          {p}
        </p>
      ))}
    </div>
  );

  const art = (
    <div
      style={{
        width: "100%",
        aspectRatio: "5 / 4",
        maxWidth: 560,
        background: "var(--paper)",
        border: "1px solid var(--hairline)",
        padding: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {diagram}
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={REVEAL_VARIANTS}
      transition={{ duration: DURATIONS.base, ease: EASE_OUT }}
      className="editorial-block"
    >
      {diagramSide === "left" ? (
        <>
          <div className="editorial-art">{art}</div>
          <div className="editorial-text">{text}</div>
        </>
      ) : (
        <>
          <div className="editorial-text">{text}</div>
          <div className="editorial-art">{art}</div>
        </>
      )}
      <style>{`
        .editorial-section { padding-top: 72px; padding-bottom: 72px; }
        @media (min-width: 768px) { .editorial-section { padding-top: 120px; padding-bottom: 120px; } }
        .editorial-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }
        .editorial-art, .editorial-text {
          display: flex;
          justify-content: center;
        }
        @media (min-width: 900px) {
          .editorial-block { grid-template-columns: 1fr 1fr; gap: 80px; }
          .editorial-art { justify-content: flex-start; }
          .editorial-text { justify-content: flex-start; }
        }
      `}</style>
    </motion.div>
  );
}

/* ═══ AFE structural diagram ═══
   Entities → Relations → Events → Affect. IBM Plex Mono labels, hairline strokes. */

function AFEDiagram() {
  const nodes: { x: number; y: number; label: string }[] = [
    { x: 12, y: 50, label: "ENTITIES" },
    { x: 38, y: 50, label: "RELATIONS" },
    { x: 64, y: 50, label: "EVENTS" },
    { x: 90, y: 50, label: "AFFECT" },
  ];
  return (
    <svg
      viewBox="0 0 120 70"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
      aria-label="Affective Field Equation: Entities to Relations to Events to Affect"
    >
      <defs>
        <marker
          id="afe-arrow"
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={6}
          markerHeight={6}
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="var(--ground)" />
        </marker>
      </defs>
      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1];
        return (
          <line
            key={i}
            x1={n.x + 10}
            y1={n.y}
            x2={next.x - 10}
            y2={next.y}
            stroke="var(--ground)"
            strokeWidth={0.6}
            markerEnd="url(#afe-arrow)"
          />
        );
      })}
      {nodes.map((n) => (
        <g key={n.label}>
          <rect
            x={n.x - 10}
            y={n.y - 6}
            width={20}
            height={12}
            fill="none"
            stroke="var(--ground)"
            strokeWidth={0.6}
          />
          <text
            x={n.x}
            y={n.y + 1.3}
            fill="var(--ground)"
            fontFamily="var(--font-plex-mono), monospace"
            fontSize={2.6}
            fontWeight={500}
            letterSpacing="0.12em"
            textAnchor="middle"
          >
            {n.label}
          </text>
        </g>
      ))}
      <text
        x={60}
        y={12}
        fill="var(--ground)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={2.4}
        letterSpacing="0.14em"
        opacity={0.55}
        textAnchor="middle"
      >
        AFFECTIVE FIELD EQUATION
      </text>
      <text
        x={60}
        y={66}
        fill="var(--ground)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={2.2}
        letterSpacing="0.06em"
        opacity={0.55}
        textAnchor="middle"
      >
        A = f(E, R, t)
      </text>
    </svg>
  );
}

/* ═══ Version timeline ═══
   Horizontal axis with version tags; nodes per version; colored publication status. */

type Release = {
  version: string;
  items: { title: string; status: "preprint" | "published" | "working" }[];
};

const RELEASES: Release[] = [
  {
    version: "v0.1",
    items: [{ title: "Affective Field Model, note", status: "working" }],
  },
  {
    version: "v0.5",
    items: [
      { title: "Meaning Field Model, figure", status: "working" },
      { title: "Chroma Data Model, figure", status: "working" },
    ],
  },
  {
    version: "v1.0",
    items: [
      { title: "Emotion as System, preprint", status: "preprint" },
      { title: "Chroma, project", status: "working" },
    ],
  },
];

const STATUS_COLOR: Record<Release["items"][number]["status"], string> = {
  preprint: "var(--data-teal)",
  published: "var(--field-blue)",
  working: "var(--affect-violet)",
};

function VersionTimeline() {
  const cx = [18, 50, 82];
  const axisY = 22;
  return (
    <svg
      viewBox="0 0 100 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
      aria-label="Version timeline"
    >
      <text
        x={50}
        y={6}
        fill="var(--ground)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={2.4}
        letterSpacing="0.14em"
        opacity={0.55}
        textAnchor="middle"
      >
        VERSION TIMELINE
      </text>
      <line
        x1={12}
        y1={axisY}
        x2={88}
        y2={axisY}
        stroke="var(--ground)"
        strokeWidth={0.5}
      />
      {cx.map((x, i) => {
        const release = RELEASES[i];
        return (
          <g key={release.version}>
            <circle cx={x} cy={axisY} r={1.8} fill="var(--ground)" />
            <text
              x={x}
              y={axisY - 4}
              fill="var(--ground)"
              fontFamily="var(--font-plex-mono), monospace"
              fontSize={2.6}
              fontWeight={500}
              letterSpacing="0.12em"
              textAnchor="middle"
            >
              {release.version.toUpperCase()}
            </text>
            {release.items.map((item, j) => {
              const y = axisY + 8 + j * 7;
              return (
                <g key={j}>
                  <circle cx={x - 14} cy={y - 0.9} r={0.9} fill={STATUS_COLOR[item.status]} />
                  <text
                    x={x - 12}
                    y={y}
                    fill="var(--ground)"
                    fontFamily="var(--font-inter), sans-serif"
                    fontSize={2.3}
                    fontWeight={300}
                  >
                    {item.title}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <g transform="translate(12, 74)">
        <circle cx={0} cy={-0.6} r={0.9} fill={STATUS_COLOR.preprint} />
        <text
          x={2}
          y={0}
          fill="var(--ground)"
          fontFamily="var(--font-plex-mono), monospace"
          fontSize={2}
          letterSpacing="0.12em"
          opacity={0.7}
        >
          PREPRINT
        </text>
        <circle cx={20} cy={-0.6} r={0.9} fill={STATUS_COLOR.published} />
        <text
          x={22}
          y={0}
          fill="var(--ground)"
          fontFamily="var(--font-plex-mono), monospace"
          fontSize={2}
          letterSpacing="0.12em"
          opacity={0.7}
        >
          PUBLISHED
        </text>
        <circle cx={42} cy={-0.6} r={0.9} fill={STATUS_COLOR.working} />
        <text
          x={44}
          y={0}
          fill="var(--ground)"
          fontFamily="var(--font-plex-mono), monospace"
          fontSize={2}
          letterSpacing="0.12em"
          opacity={0.7}
        >
          WORKING
        </text>
      </g>
    </svg>
  );
}
