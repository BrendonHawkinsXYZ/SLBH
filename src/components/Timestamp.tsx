"use client";

import { useEffect, useState } from "react";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatTimestamp(): string {
  const now = new Date();
  return `UNITED STATES | ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} | ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export default function Timestamp() {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(formatTimestamp());
    const id = setInterval(() => setText(formatTimestamp()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="timer"
      aria-live="polite"
      className="anim-chrome text-sm uppercase text-[#F6F6F6] whitespace-nowrap font-[family-name:var(--font-inter)] max-md:font-[family-name:var(--font-figtree)] max-md:text-[13px] max-md:tracking-[0.04em]"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {text}
    </div>
  );
}
