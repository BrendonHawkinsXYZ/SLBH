"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MorphShape } from "./MorphShape";

export function AmbientShape() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const gallery = document.getElementById("home-gallery");
      setVisible(Boolean(gallery && gallery.getBoundingClientRect().bottom <= 0));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  if (pathname !== "/") return null;
  return <div className={`floating-shape${visible ? " floating-shape--visible" : ""}`} aria-hidden="true">
    {visible && <MorphShape />}
  </div>;
}
