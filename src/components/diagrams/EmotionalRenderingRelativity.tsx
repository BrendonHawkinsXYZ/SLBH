/* Emotional Rendering Relativity, FIG. 03
   Inline SVG poster. 4:5 ratio, dark register.
   4×3 grid of emotion color fields. Portrait asset not bundled in v2.0;
   swatches carry the applied color until the WebP lands. */

const EMOTIONS: { label: string; tint: string }[] = [
  { label: "HAPPY", tint: "#F2B8BE" },
  { label: "SAD", tint: "#D6D1A6" },
  { label: "ANGRY", tint: "#B9C2D1" },
  { label: "EXCITED", tint: "#D6B0C7" },
  { label: "AFRAID", tint: "#DEDEDE" },
  { label: "LOVED", tint: "#E8C9B8" },
  { label: "SURPRISED", tint: "#B4D7B6" },
  { label: "DESIRE", tint: "#8ED8CE" },
  { label: "ENVY", tint: "#E8D6C4" },
  { label: "FEAR", tint: "#E0B89C" },
  { label: "INTEREST", tint: "#DCD98E" },
  { label: "PRIDE", tint: "#C9B2DE" },
];

export function EmotionalRenderingRelativity() {
  const VB_W = 400;
  const VB_H = 500;
  const cols = 4;
  const rows = 3;
  const gridX = 40;
  const gridY = 90;
  const gridW = VB_W - gridX * 2;
  const tileGap = 12;
  const tileW = (gridW - tileGap * (cols - 1)) / cols;
  const labelGap = 16;
  const rowH = tileW + labelGap + 16;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-label="Emotional Rendering Relativity"
    >
      <rect x={0} y={0} width={VB_W} height={VB_H} fill="var(--ground)" />

      <text
        x={VB_W / 2}
        y={54}
        fill="var(--signal)"
        fontFamily="var(--font-orbitron), sans-serif"
        fontWeight={500}
        fontSize={15}
        letterSpacing="0.12em"
        textAnchor="middle"
      >
        EMOTIONAL RENDERING RELATIVITY
      </text>

      {EMOTIONS.map((e, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const x = gridX + c * (tileW + tileGap);
        const y = gridY + r * rowH;
        return (
          <g key={e.label}>
            <rect
              x={x}
              y={y}
              width={tileW}
              height={tileW}
              fill={e.tint}
              opacity={0.85}
            />
            <rect
              x={x}
              y={y}
              width={tileW}
              height={tileW}
              fill="none"
              stroke="rgba(245,245,243,0.18)"
              strokeWidth={0.4}
            />
            <text
              x={x + tileW / 2}
              y={y + tileW + labelGap}
              fill="var(--signal)"
              fontFamily="var(--font-orbitron), sans-serif"
              fontWeight={500}
              fontSize={8}
              letterSpacing="0.14em"
              textAnchor="middle"
            >
              {e.label}
            </text>
          </g>
        );
      })}

      <text
        x={40}
        y={VB_H - 30}
        fill="var(--signal)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={8}
        letterSpacing="0.14em"
        opacity={0.55}
      >
        AFFECTIVE COMPUTATIONAL GEOMETRY
      </text>
      <text
        x={VB_W - 40}
        y={VB_H - 30}
        fill="var(--signal)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={8}
        letterSpacing="0.14em"
        opacity={0.55}
        textAnchor="end"
      >
        STUDIO LAB BH
      </text>
    </svg>
  );
}
