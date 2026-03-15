"use client";

import { useEffect, useRef } from "react";

function useMissionReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const PIPELINE_STAGES = [
  {
    numeral: "I",
    code: "PHASE_01 // TR-FND",
    title: "Foundational Theory",
    description:
      "Establishing rigorous theoretical frameworks defining emotion as a measurable variable.",
  },
  {
    numeral: "II",
    code: "PHASE_02 // TR-MSR",
    title: "Measurement Systems",
    description:
      "Developing non-invasive, continuous protocols for capturing affective data signals.",
  },
  {
    numeral: "III",
    code: "PHASE_03 // TR-CMP",
    title: "Computational Models",
    description:
      "Translating raw affective signals into structured, predictive geometric models.",
  },
  {
    numeral: "IV",
    code: "PHASE_04 // TR-APP",
    title: "Applied Interfaces",
    description:
      "Designing tools that leverage emotional data to support human wellbeing and systemic design.",
  },
];

const RESEARCH_VECTORS = [
  {
    name: "Emotional Systems",
    description:
      "The foundational study of emotion as a dynamic, interrelated network.",
    code: "DIR. AFFECTIVE RESEARCH / CORE",
  },
  {
    name: "Affective Computational Geometry",
    description:
      "Mathematical approaches to defining and modeling complex emotional states.",
    code: "APPLIED MATHEMATICS / CHROMA SUBSYSTEM",
  },
  {
    name: "Emotion Meteorology",
    description:
      "Observation and visualization of macro-level, collective emotional patterns.",
    code: "DATA VISUALIZATION / POPULATION SCALE",
  },
  {
    name: "Human-AI Emotional Interfaces",
    description:
      "Technologies designed to intelligently parse and respond to human affective states.",
    code: "HCI / AUTONOMOUS SYSTEMS",
  },
];

const PRINCIPLES = [
  { num: "P—01", name: "Emotion as Architecture" },
  { num: "P—02", name: "Engineering Mindset" },
  { num: "P—03", name: "Data as Material" },
  { num: "P—04", name: "Color as Signal" },
  { num: "P—05", name: "Media as Communication" },
  { num: "P—06", name: "Lead with Design Thinking" },
  { num: "P—07", name: "Fluid Boundaries" },
];

const LABEL_CLASS =
  "font-[family-name:var(--font-orbitron)] text-[10px] uppercase tracking-[0.2em] text-[#3A3A3A]";

function SectionLabel({
  label,
  subtitle,
}: {
  label: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-baseline gap-4 mb-8">
      <span className={LABEL_CLASS}>{label}</span>
      {subtitle && (
        <>
          <span className="text-[#3A3A3A] text-[10px]">—</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#3A3A3A]">
            {subtitle}
          </span>
        </>
      )}
    </div>
  );
}

export default function MissionSection() {
  const heroRef = useMissionReveal();
  const infraRef = useMissionReveal();
  const methodRef = useMissionReveal();
  const pipelineRef = useMissionReveal();
  const vectorsRef = useMissionReveal();
  const principlesRef = useMissionReveal();

  return (
    <section
      id="mission"
      className="w-full bg-[#0A0A0A] px-10 py-[120px] max-md:px-6 max-md:py-20"
    >
      <div className="max-w-[760px] mx-auto space-y-[120px] max-md:space-y-20">

        {/* ── 00. MISSION HERO ── */}
        <div ref={heroRef} className="mission-reveal">
          <p className={`${LABEL_CLASS} mb-10`}>
            STUDIO LAB BH // RESEARCH INSTITUTE
          </p>
          <p
            className="font-[family-name:var(--font-inter)] font-light text-[#F5F5F5] leading-[1.45] mb-6"
            style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)" }}
          >
            Studio Lab BH is a systems research lab developing computational
            models of the invisible structures that organize human experience,
            beginning with affective systems.
          </p>
          <p className="font-[family-name:var(--font-inter)] font-light text-[16px] text-[#A0A0A0] leading-[1.7]">
            The lab studies emotion as an observable and modelable system that
            shapes perception, behavior, and collective life.
          </p>
        </div>

        {/* ── 01. THE VOID IN INFRASTRUCTURE ── */}
        <div ref={infraRef} className="mission-reveal">
          <SectionLabel
            label="01. THE VOID IN INFRASTRUCTURE"
            subtitle="The Measurement Gap"
          />
          <p className="font-[family-name:var(--font-inter)] text-[16px] text-[#A0A0A0] leading-[1.7]">
            Modern technological systems comprehensively map behavior, location,
            and information interaction. Yet, the foundational driver of human
            decision-making—emotional experience—remains largely unmeasured and
            invisible to these systems. Without frameworks for modeling emotion,
            digital infrastructure operates on an incomplete understanding of
            the human condition.
          </p>
        </div>

        {/* ── 02. METHODOLOGICAL STANCE ── */}
        <div ref={methodRef} className="mission-reveal">
          <SectionLabel
            label="02. METHODOLOGICAL STANCE"
            subtitle="Dynamic Systems Approach"
          />
          <p className="font-[family-name:var(--font-inter)] text-[16px] text-[#A0A0A0] leading-[1.7]">
            Studio Lab BH treats emotion as a dynamic, interconnected system. By
            synthesizing computational modeling, affective science, and design
            research, we construct frameworks for observing, mapping, and
            translating complex emotional topographies into legible data
            structures.
          </p>
        </div>

        {/* ── TRANSLATIONAL ARCHITECTURE — PIPELINE ── */}
        <div ref={pipelineRef} className="mission-reveal">
          <SectionLabel
            label="Translational Architecture"
            subtitle="DEPLOYMENT PIPELINE"
          />
          <div className="border-t border-[#3A3A3A]">
            {PIPELINE_STAGES.map((stage, i) => (
              <div
                key={stage.numeral}
                className="grid grid-cols-[40px_1fr] gap-6 border-b border-[#3A3A3A] py-6"
              >
                {/* Left: numeral + connector */}
                <div className="relative flex flex-col items-center pt-1">
                  <span className="font-[family-name:var(--font-orbitron)] text-[11px] text-[#3A3A3A] tracking-wider">
                    {stage.numeral}
                  </span>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <div className="w-px flex-1 bg-[#3A3A3A] mt-3 min-h-[24px]" />
                  )}
                </div>
                {/* Right: code, title, description */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#3A3A3A] mb-2">
                    {stage.code}
                  </p>
                  <p className="font-[family-name:var(--font-inter)] text-[15px] text-[#F5F5F5] font-normal mb-2">
                    {stage.title}
                  </p>
                  <p className="font-[family-name:var(--font-inter)] text-[14px] text-[#A0A0A0] leading-[1.65]">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CURRENT RESEARCH VECTORS ── */}
        <div ref={vectorsRef} className="mission-reveal">
          <SectionLabel
            label="Current Research Vectors"
            subtitle="ACTIVE TAXONOMY"
          />
          <div className="flex flex-col gap-6">
            {RESEARCH_VECTORS.map((v) => (
              <div
                key={v.name}
                className="border-l border-[rgba(245,245,243,0.3)] pl-4"
              >
                <p className="font-[family-name:var(--font-inter)] text-[15px] text-[#F5F5F5] font-normal mb-1">
                  {v.name}
                </p>
                <p className="font-[family-name:var(--font-inter)] text-[14px] text-[#A0A0A0] leading-[1.65] mb-2">
                  {v.description}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#3A3A3A]">
                  {v.code}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRINCIPLES ── */}
        <div ref={principlesRef} className="mission-reveal">
          <SectionLabel label="Principles" />
          {/* background-gap technique: outer bg sets the gap color, inner cells set their own bg */}
          <div
            className="grid grid-cols-2 max-md:grid-cols-1 gap-px"
            style={{ background: "rgba(245,245,243,0.04)" }}
          >
            {PRINCIPLES.map((p) => (
              <div
                key={p.num}
                className="bg-[#0A0A0A] px-5 py-5 flex flex-col gap-2"
              >
                <span className="font-[family-name:var(--font-orbitron)] text-[10px] tracking-[0.15em] text-[#3A3A3A]">
                  {p.num}
                </span>
                <span className="font-[family-name:var(--font-inter)] text-[14px] text-[#F5F5F5] font-normal">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
