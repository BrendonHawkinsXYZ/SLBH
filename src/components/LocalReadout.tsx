"use client";

import { useEffect, useState } from "react";
import styles from "./LocalReadout.module.css";

type Clock = { time: string; date: string; iso: string };

function cityName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const city = value.trim().replace(/\s+/g, " ");
  if (!city || city.length > 80 || /^(none|null|undefined|unknown)$/i.test(city)) return null;
  return /^[\p{L}\p{M}\p{N} .'’(),/\-]+$/u.test(city) ? city : null;
}

function timezoneLocation(): string {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const place = zone?.includes("/") && !zone.startsWith("Etc/")
    ? zone.split("/").pop()?.replaceAll("_", " ")
    : zone === "UTC" ? "UTC" : "Local";
  return cityName(place) ?? "Local";
}

export function LocalReadout() {
  // An empty initial render matches the server, whose time zone is irrelevant.
  const [clock, setClock] = useState<Clock | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    const timeFormat = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    });
    const dateFormat = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
    let timer = 0;
    const tick = () => {
      const now = new Date();
      setClock({ time: timeFormat.format(now), date: dateFormat.format(now), iso: now.toISOString() });
      // Align with the next second and always read the current browser clock.
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 10);
    };
    const frame = requestAnimationFrame(() => {
      setLocation(timezoneLocation());
      tick();
    });
    return () => { cancelAnimationFrame(frame); window.clearTimeout(timer); };
  }, []);

  return (
    <p className={styles.readout} aria-live="off">
      <time className={styles.time} dateTime={clock?.iso} title="Your local time">
        {clock?.time ?? "—:—:—"}
      </time>
      <time className={styles.date} dateTime={clock?.iso}>
        {clock?.date ?? ""}
      </time>
      <span
        className={styles.location}
        title="Approximate location from browser time zone"
      >
        {location ?? "—"}
      </span>
    </p>
  );
}
