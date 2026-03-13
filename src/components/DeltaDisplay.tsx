"use client";

interface DeltaDisplayProps {
  magnitude: number;
}

export default function DeltaDisplay({ magnitude }: DeltaDisplayProps) {
  const sign = magnitude >= 0 ? "+" : "";
  return (
    <div className="text-center">
      <span className="font-[family-name:var(--font-inter)] text-base tracking-[0.02em] text-[#A0A0A0] max-md:text-xs">
        ΔA {sign}{magnitude.toFixed(2)}
      </span>
    </div>
  );
}
