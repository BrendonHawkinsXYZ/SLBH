"use client";

interface MetricsBlockProps {
  volatility: number;
  coherence: number;
  confidence: number;
}

export default function MetricsBlock({ volatility, coherence, confidence }: MetricsBlockProps) {
  const metrics = [
    { label: "VOLATILITY", value: volatility.toFixed(2) },
    { label: "COHERENCE", value: coherence.toFixed(2) },
    { label: "CONFIDENCE", value: confidence.toFixed(2) },
  ];

  return (
    <div>
      {metrics.map((m) => (
        <div
          key={m.label}
          className="font-[family-name:var(--font-inter)] text-xs leading-6 whitespace-nowrap max-md:text-[8px] max-md:leading-4"
        >
          <span className="text-[#A0A0A0] uppercase">{m.label}</span>{" "}
          <span className="text-[#F5F5F3]">{m.value}</span>
        </div>
      ))}
    </div>
  );
}
