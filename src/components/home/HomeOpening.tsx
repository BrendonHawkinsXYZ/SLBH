"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { getOpeningQuestionDuration, getRandomOpeningQuestion, HOME_OPENING_FAILSAFE_MS } from "@/lib/homeOpening";
import { homeQuestions, type HomeQuestion } from "@/lib/homeQuestions";

type Phase = "pending" | "intro" | "out" | "waiting" | "image" | "ready";
const HomeOpeningContext = createContext({ complete: true, onReady: () => {}, visit: 0 });

export function useHomeOpening() {
  return useContext(HomeOpeningContext);
}

export function HomeOpening({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("pending");
  const [assetReady, setAssetReady] = useState(false);
  const [visit, setVisit] = useState(0);
  const question = useRef<HomeQuestion | null>(null);
  const failsafe = useRef(0);
  const onReady = useCallback(() => setAssetReady(true), []);
  const finish = useCallback(() => {
    window.clearTimeout(failsafe.current);
    document.documentElement.dataset.homeOpening = "ready";
    setPhase("ready");
  }, []);
  const reveal = useCallback(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(previous => previous === "intro" || previous === "pending" ? reduced ? "waiting" : "out" : previous);
  }, []);
  const showQuestion = useCallback((selected: HomeQuestion) => {
    const root = document.documentElement;
    if (root.dataset.homeQuestion) root.style.removeProperty(`--home-question-${root.dataset.homeQuestion}`);
    question.current = selected;
    root.dataset.homeQuestion = String(selected.id);
    root.style.setProperty(`--home-question-${selected.id}`, "block");
    root.dataset.homeOpening = "intro";
    window.clearTimeout(failsafe.current);
    failsafe.current = window.setTimeout(finish, HOME_OPENING_FAILSAFE_MS);
    setAssetReady(false);
    setVisit(previous => previous + 1);
    setPhase("intro");
  }, [finish]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    window.clearTimeout(Number(root.dataset.homeOpeningTimer));
    delete root.dataset.homeOpeningTimer;
    // Reuse the pre-paint selection on a full load. Client-side returns to the
    // homepage select afresh; the ref only stabilizes React's effect replay.
    const prepared = homeQuestions.find(item => String(item.id) === root.dataset.homeQuestion);
    showQuestion(question.current ?? prepared ?? getRandomOpeningQuestion());
    return () => {
      window.clearTimeout(failsafe.current);
      if (root.dataset.homeQuestion) root.style.removeProperty(`--home-question-${root.dataset.homeQuestion}`);
      delete root.dataset.homeQuestion;
      delete root.dataset.homeOpening;
    };
  }, [showQuestion]);

  useEffect(() => {
    if (phase === "pending") return;
    document.documentElement.dataset.homeOpening = phase;
    if (phase === "ready") window.clearTimeout(failsafe.current);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next: Partial<Record<Phase, [number, Phase]>> = {
      intro: [getOpeningQuestionDuration(question.current!), reduced ? "waiting" : "out"],
      out: [450, "waiting"],
      image: [700, "ready"],
    };
    const transition = next[phase];
    if (!transition) return;
    const timer = window.setTimeout(() => setPhase(transition[1]), transition[0]);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "waiting" && assetReady) {
      setPhase(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "ready" : "image");
    }
  }, [phase, assetReady]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") reveal();
    };
    const pageshow = (event: PageTransitionEvent) => { if (event.persisted) showQuestion(getRandomOpeningQuestion()); };
    document.addEventListener("slbh-home-opening-skip", finish);
    document.addEventListener("keydown", keydown);
    window.addEventListener("pageshow", pageshow);
    return () => {
      document.removeEventListener("slbh-home-opening-skip", finish);
      document.removeEventListener("keydown", keydown);
      window.removeEventListener("pageshow", pageshow);
    };
  }, [finish, reveal, showQuestion]);

  return <HomeOpeningContext.Provider value={{ complete: phase === "ready", onReady, visit }}>
    <div className="home-intro site-surface" role="dialog" aria-label="A question from Studio Lab BH" aria-modal={phase === "pending" || phase === "intro" ? true : undefined} aria-hidden={phase !== "pending" && phase !== "intro"}>
      <div className="home-intro-copy">
        {homeQuestions.map(item => <p key={item.id} data-opening-question={item.id} style={{ display: `var(--home-question-${item.id}, none)` }}>{item.text}</p>)}
      </div>
      <button type="button" className="home-intro-enter" aria-label="Enter Studio Lab BH" tabIndex={phase === "intro" ? 0 : -1} onClick={reveal} />
    </div>
    {children}
  </HomeOpeningContext.Provider>;
}
