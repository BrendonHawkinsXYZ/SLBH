"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const FALLBACK_LAT = 40.787;
const FALLBACK_LON = -73.9754;
const GEO_TIMEOUT_MS = 3000;

function formatClock(date: Date) {
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
  const tzParts = new Intl.DateTimeFormat(undefined, {
    timeZoneName: "short",
  }).formatToParts(date);
  const tz = tzParts.find((p) => p.type === "timeZoneName")?.value ?? "";
  return `${time} ${tz}`.trim();
}

function formatCoords(lat: number, lon: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}°${ns} · ${Math.abs(lon).toFixed(4)}°${ew}`;
}

export function StatusBar() {
  const [clock, setClock] = useState<string | null>(null);
  const [coords, setCoords] = useState<string | null>(null);

  useEffect(() => {
    setClock(formatClock(new Date()));
    const id = window.setInterval(() => {
      setClock(formatClock(new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let settled = false;
    const applyFallback = () => {
      if (settled) return;
      settled = true;
      setCoords(formatCoords(FALLBACK_LAT, FALLBACK_LON));
    };

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      applyFallback();
      return;
    }

    const timer = window.setTimeout(applyFallback, GEO_TIMEOUT_MS);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        setCoords(formatCoords(pos.coords.latitude, pos.coords.longitude));
      },
      () => {
        window.clearTimeout(timer);
        applyFallback();
      },
      { timeout: GEO_TIMEOUT_MS, maximumAge: 60_000 },
    );

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className="hairline-b"
      style={{
        background: "var(--status-bg)",
        height: 40,
        padding: "10px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span className="t-label" style={{ color: "var(--ground)" }}>
        Latest
      </span>
      <span
        className="t-mono"
        style={{ color: "var(--ground)", opacity: 0.72 }}
      >
        EMOTION AS SYSTEM · ARXIV TK · PREPRINT, FEB 2026
      </span>

      <span style={{ marginLeft: "auto", display: "flex", gap: 16, alignItems: "center" }}>
        <span
          className="t-mono"
          style={{ color: "var(--ground)", opacity: 0.72, minWidth: 96, textAlign: "right" }}
        >
          {clock ?? ""}
        </span>
        <span
          className="t-mono"
          style={{ color: "var(--ground)", opacity: 0.72 }}
        >
          {coords ?? ""}
        </span>
        <Link
          href="/research/emotion-as-system"
          className="t-mono link-quiet"
          style={{
            color: "var(--ground)",
            fontWeight: 500,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          READ PAPER ↗
        </Link>
      </span>
    </div>
  );
}
