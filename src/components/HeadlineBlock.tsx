"use client";

export default function HeadlineBlock() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-orbitron-regular)] text-[40px] leading-[1.18] text-[#F5F5F5] max-w-[400px] max-lg:text-[32px] max-md:text-[22px] max-md:leading-[1.2] max-md:max-w-[280px]">
        Mapping the{" "}
        <span className="font-[family-name:var(--font-orbitron-extrabold)]">
          Architecture
        </span>{" "}
        of Human Emotion
      </h1>
      <p className="mt-6 font-[family-name:var(--font-inter)] text-base leading-[1.6] text-[#A0A0A0] max-w-[420px] max-lg:text-sm max-md:text-[11px] max-md:leading-[1.5] max-md:max-w-[320px] max-md:mt-2">
        Studio Lab BH models collective emotional states as infrastructure.
        Treating affect as a fluid dynamic system, we apply meteorological
        methods to observe, predict, and visualize the emotional currents
        shaping human behavior.
      </p>
    </div>
  );
}
