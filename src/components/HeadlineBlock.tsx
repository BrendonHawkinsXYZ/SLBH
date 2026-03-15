"use client";

export default function HeadlineBlock() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-orbitron-regular)] text-[40px] leading-[1.18] text-[#F5F5F5] max-w-[400px] max-lg:text-[32px] max-md:text-2xl max-md:leading-[1.2] max-md:max-w-[280px]">
        Mapping the{" "}
        <span className="font-[family-name:var(--font-orbitron-extrabold)]">
          Architecture
        </span>{" "}
        of Human Emotion
      </h1>
      <p className="anim-slide-up-body mt-6 font-[family-name:var(--font-inter)] text-base leading-[1.6] text-[#A0A0A0] max-w-[420px] max-lg:text-sm max-md:text-xs max-md:leading-[1.5] max-md:max-w-[320px] max-md:mt-2">
        We advance the science of human emotion by translating foundational
        theory into measurable systems, computational models, and real-world
        applications.
      </p>
    </div>
  );
}
