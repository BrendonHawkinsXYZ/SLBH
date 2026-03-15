"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Timestamp from "@/components/Timestamp";
import Footer from "@/components/Footer";
import OrbCanvas from "@/components/OrbCanvas";
import EmotionStack from "@/components/EmotionStack";
import MetricsBlock from "@/components/MetricsBlock";
import DeltaDisplay from "@/components/DeltaDisplay";
import HeadlineBlock from "@/components/HeadlineBlock";
import { fetchAllChromaData } from "@/lib/chroma";
import type { ChromaPageData } from "@/lib/chroma-types";
import MissionSection from "@/components/MissionSection";

export default function Home() {
  const [data, setData] = useState<ChromaPageData | null>(null);

  useEffect(() => {
    fetchAllChromaData().then(setData);
    const interval = setInterval(() => {
      fetchAllChromaData().then(setData);
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const hasData = data !== null;

  return (
    <div className="relative w-full bg-background text-foreground">
      {/* Viewport-locked dashboard */}
      <div className="relative w-full h-screen h-[100dvh] flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Timestamp — absolute center on desktop, relative row on tablet/mobile */}
      <div className="hidden lg:block absolute left-1/2 top-8 -translate-x-1/2 z-10">
        <Timestamp />
      </div>
      <div className="lg:hidden flex justify-center pt-2 px-6">
        <Timestamp />
      </div>

      {/* Main content */}
      <main
        className={`
          flex-1 min-h-0
          grid grid-cols-[minmax(300px,420px)_1fr] grid-rows-[auto_auto_1fr_auto]
          gap-x-10 gap-y-0
          px-10 pt-[100px]
          max-lg:grid-cols-[minmax(240px,360px)_1fr] max-lg:px-8 max-lg:pt-[60px] max-lg:gap-x-6
          max-md:flex max-md:flex-col max-md:px-6 max-md:pt-2 max-md:gap-0
        `}
      >
        {/* ═══ LEFT COLUMN — DESKTOP/TABLET ═══ */}

        {/* Emotion Stack */}
        {hasData && (
          <div className="col-start-1 row-start-1 self-start anim-slide-left-emo max-md:order-2 max-md:w-1/2 max-md:anim-slide-up-delta">
            <EmotionStack emotions={data.emotions.top_emotions} />
          </div>
        )}

        {/* Metrics Block */}
        {hasData && (
          <div
            className={`
              col-start-1 row-start-2 mt-8
              anim-slide-left-metrics
              max-md:order-2 max-md:self-end max-md:text-right max-md:w-1/2 max-md:mt-[-64px]
            `}
          >
            <MetricsBlock
              volatility={data.fieldState.volatility_score}
              coherence={data.fieldState.coherence_score}
              confidence={data.delta.confidence}
            />
          </div>
        )}

        {/* Headline + Body — pushed to bottom */}
        <div className="col-start-1 row-start-3 self-end pb-5 anim-slide-up-headline max-md:order-3 max-md:self-auto max-md:pb-0 max-md:mt-3">
          <HeadlineBlock />
        </div>

        {/* Body copy animation wrapper — separate delay on mobile */}
        {/* Body copy delay is handled inside HeadlineBlock via the p tag */}

        {/* ═══ RIGHT ZONE — ORB + DELTA ═══ */}
        <div
          className={`
            col-start-2 row-start-1 row-span-4
            flex flex-col items-center justify-center
            max-md:order-1 max-md:flex-1 max-md:min-h-0 max-md:mb-1
          `}
        >
          {hasData && (
            <>
              <div className="anim-orb-reveal">
                <OrbCanvas colorHistory={data.colorHistory} />
              </div>
              <div className="mt-6 anim-slide-up-delta max-md:mt-2 max-md:mb-0">
                <DeltaDisplay magnitude={data.delta.delta_magnitude} />
              </div>
            </>
          )}
        </div>
      </main>

      </div>{/* end viewport-locked dashboard */}

      {/* Mission section */}
      <MissionSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
