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

export default function HomeClient({ initialData }: { initialData: ChromaPageData | null }) {
  const [data, setData] = useState<ChromaPageData | null>(initialData);

  useEffect(() => {
    // Initial data already provided by server — just set up the refresh interval
    const interval = setInterval(() => {
      fetchAllChromaData().then((d) => { if (d) setData(d); });
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

        {/* Delta — left column, between metrics and headline */}
        {hasData && (
          <div className="col-start-1 row-start-3 self-start mt-8 anim-slide-up-delta max-md:order-2 max-md:mt-3 max-md:w-full">
            <DeltaDisplay magnitude={data.delta.delta_magnitude} />
          </div>
        )}

        {/* Headline + Body — pushed to bottom */}
        <div className="col-start-1 row-start-3 self-end pb-5 anim-slide-up-headline max-md:order-3 max-md:self-auto max-md:pb-0 max-md:mt-3">
          <HeadlineBlock />
        </div>

        {/* ═══ RIGHT ZONE — ORB ═══ */}
        <div
          className={`
            col-start-2 row-start-1 row-span-4
            relative flex flex-col items-center justify-center
            max-md:order-1 max-md:flex-1 max-md:min-h-0 max-md:mb-1
          `}
        >
          {hasData && (
            <div className="anim-orb-reveal">
              <OrbCanvas colorHistory={data.colorHistory} />
            </div>
          )}
          <p className="absolute bottom-5 text-[10px] tracking-[0.18em] uppercase text-[rgba(245,245,243,0.28)] max-md:hidden">
            Current United States Emotional Field State
          </p>
        </div>
      </main>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-10 scroll-indicator max-md:bottom-4">
        <div className="w-px h-6 bg-[rgba(245,245,243,0.5)] max-md:h-4" />
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="rgba(245,245,243,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      </div>{/* end viewport-locked dashboard */}

      {/* Mission section */}
      <MissionSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
