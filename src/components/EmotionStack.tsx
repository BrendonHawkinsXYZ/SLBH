"use client";

import type { EmotionEntry } from "@/lib/chroma-types";

interface EmotionStackProps {
  emotions: EmotionEntry[];
}

export default function EmotionStack({ emotions }: EmotionStackProps) {
  return (
    <div>
      {emotions.slice(0, 3).map((e) => (
        <div
          key={e.label}
          className="font-[family-name:var(--font-inter)] text-xl leading-[34px] uppercase text-[#F5F5F5] whitespace-pre max-md:text-xs max-md:leading-[22px]"
        >
          {e.label.toUpperCase()}
          <span className="text-[#A0A0A0]">
            {" "}· {Math.round(e.score * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}
