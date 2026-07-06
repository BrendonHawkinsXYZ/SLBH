"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

const TZ_CITY: Record<string, string> = {
  "America/New_York": "New York",
  "America/Chicago": "Chicago",
  "America/Denver": "Denver",
  "America/Phoenix": "Phoenix",
  "America/Los_Angeles": "Los Angeles",
  "America/Anchorage": "Anchorage",
  "Pacific/Honolulu": "Honolulu",
  "America/Toronto": "Toronto",
  "America/Vancouver": "Vancouver",
  "America/Montreal": "Montréal",
  "America/Mexico_City": "Mexico City",
  "America/Sao_Paulo": "São Paulo",
  "America/Argentina/Buenos_Aires": "Buenos Aires",
  "America/Bogota": "Bogotá",
  "America/Lima": "Lima",
  "America/Santiago": "Santiago",
  "Europe/London": "London",
  "Europe/Paris": "Paris",
  "Europe/Berlin": "Berlin",
  "Europe/Madrid": "Madrid",
  "Europe/Rome": "Rome",
  "Europe/Amsterdam": "Amsterdam",
  "Europe/Brussels": "Brussels",
  "Europe/Zurich": "Zürich",
  "Europe/Vienna": "Vienna",
  "Europe/Warsaw": "Warsaw",
  "Europe/Prague": "Prague",
  "Europe/Stockholm": "Stockholm",
  "Europe/Oslo": "Oslo",
  "Europe/Copenhagen": "Copenhagen",
  "Europe/Helsinki": "Helsinki",
  "Europe/Athens": "Athens",
  "Europe/Istanbul": "Istanbul",
  "Europe/Moscow": "Moscow",
  "Asia/Dubai": "Dubai",
  "Asia/Karachi": "Karachi",
  "Asia/Kolkata": "Mumbai",
  "Asia/Dhaka": "Dhaka",
  "Asia/Bangkok": "Bangkok",
  "Asia/Jakarta": "Jakarta",
  "Asia/Singapore": "Singapore",
  "Asia/Shanghai": "Shanghai",
  "Asia/Tokyo": "Tokyo",
  "Asia/Seoul": "Seoul",
  "Asia/Taipei": "Taipei",
  "Asia/Hong_Kong": "Hong Kong",
  "Asia/Kuala_Lumpur": "Kuala Lumpur",
  "Asia/Riyadh": "Riyadh",
  "Asia/Tel_Aviv": "Tel Aviv",
  "Australia/Sydney": "Sydney",
  "Australia/Melbourne": "Melbourne",
  "Australia/Perth": "Perth",
  "Pacific/Auckland": "Auckland",
  "Africa/Johannesburg": "Johannesburg",
  "Africa/Cairo": "Cairo",
  "Africa/Lagos": "Lagos",
  "Africa/Nairobi": "Nairobi",
};

function getCityFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TZ_CITY[tz]) return TZ_CITY[tz];
    // Fall back to humanizing the city part of the IANA name
    const part = tz.split("/").pop() ?? tz;
    return part.replace(/_/g, " ");
  } catch {
    return "New York";
  }
}

export function StatusBar() {
  const pathname = usePathname();
  const [clock, setClock] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    // Time and locale only exist client-side; SSR renders the null placeholder.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClock(formatClock(new Date()));
    setCity(getCityFromTimezone());
    const id = window.setInterval(() => {
      setClock(formatClock(new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // The home hero owns the top of the screen — the strip lives on every other route.
  if (pathname === "/") return null;

  return (
    <div
      className="hairline-b status-bar"
      style={{
        background: "var(--status-bg)",
        height: 40,
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        overflow: "hidden",
      }}
    >
      <span className="t-label" style={{ color: "var(--ground)", flexShrink: 0 }}>
        Latest
      </span>
      <span
        className="t-mono status-pub"
        style={{ color: "var(--ground)", opacity: 0.72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        GLOBAL EMOTIONS · LIVE INSTRUMENT
      </span>

      <span style={{ marginLeft: "auto", display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
        <span
          className="t-mono"
          style={{
            color: "var(--ground)",
            opacity: 0.72,
            minWidth: 96,
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {clock ?? ""}
        </span>
        <span
          className="t-mono status-city"
          style={{ color: "var(--ground)", opacity: 0.72 }}
        >
          {city ?? ""}
        </span>
        <Link
          href="https://globalemotions.studiolabbh.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="t-mono link-quiet status-read"
          style={{
            color: "var(--ground)",
            fontWeight: 500,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          VIEW LIVE ↗︎
        </Link>
      </span>

      <style>{`
        @media (max-width: 639px) {
          .status-pub { display: none; }
          .status-city { display: none; }
          .status-read { display: none; }
        }
        @media (max-width: 767px) {
          .status-bar { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  );
}
