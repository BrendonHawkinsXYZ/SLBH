"use client";

import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    window.location.href = "mailto:brendon@studiolabbh.xyz";
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background text-foreground">
      <a
        href="mailto:brendon@studiolabbh.xyz"
        className="font-[family-name:var(--font-inter)] text-sm text-[#A0A0A0] underline"
      >
        brendon@studiolabbh.xyz
      </a>
    </div>
  );
}
