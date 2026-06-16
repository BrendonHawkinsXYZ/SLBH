const phases = [
  {
    index: "01",
    name: "AMERICAN EMOTIONS",
    range: "2024",
    duration: "7 MONTHS",
    status: "COMPLETE",
  },
  {
    index: "02",
    name: "NEW YORK EMOTIONS",
    range: "2025",
    duration: "6 WEEKS",
    status: "COMPLETE",
  },
  {
    index: "03",
    name: "AMERICAN EMOTIONS",
    range: "APR 2026 —",
    duration: "ONGOING",
    status: "ONGOING",
  },
];

export function IterationTimeline() {
  return (
    <div style={{ width: "100%" }}>
      {phases.map((p, i) => (
        <div
          key={p.index}
          style={{
            borderTop: "0.5px solid var(--hairline)",
            paddingTop: 20,
            paddingBottom: 20,
            borderBottom: i === phases.length - 1 ? "0.5px solid var(--hairline)" : undefined,
            display: "grid",
            gridTemplateColumns: "32px 1fr auto",
            gap: "0 16px",
            alignItems: "start",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 10,
              opacity: 0.45,
              paddingTop: 2,
            }}
          >
            {p.index}
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: "0.04em",
              }}
            >
              {p.name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontSize: 10,
                opacity: 0.55,
              }}
            >
              {p.range} · {p.duration}
            </span>
          </div>

          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 9,
              letterSpacing: "0.14em",
              border: "1px solid var(--hairline-strong)",
              padding: "5px 10px",
              whiteSpace: "nowrap",
              opacity: p.status === "ONGOING" ? 1 : 0.55,
            }}
          >
            {p.status}
          </span>
        </div>
      ))}
    </div>
  );
}
