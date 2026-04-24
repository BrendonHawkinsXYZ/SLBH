/* Affective Systems Matrix, FIG. 01
   Inline SVG poster. 4:5 ratio, dark register. */

const COLUMNS = ["AFFECT", "EMOTION", "SENTIMENT"] as const;
const ROWS = ["INDIVIDUAL", "DYADIC", "GROUP", "CULTURE"] as const;

const CELLS: Record<
  (typeof ROWS)[number],
  Record<(typeof COLUMNS)[number], [string, string]>
> = {
  INDIVIDUAL: {
    AFFECT: ["PHYSIOLOGICAL", "SUBSTRATE"],
    EMOTION: ["CONSCIOUS", "APPRAISAL"],
    SENTIMENT: ["NARRATIVE", "INTERPRETATION"],
  },
  DYADIC: {
    AFFECT: ["AFFECTIVE", "COUPLING"],
    EMOTION: ["EXPRESSIVE", "SIGNALING"],
    SENTIMENT: ["RELATIONAL", "MEANING"],
  },
  GROUP: {
    AFFECT: ["COLLECTIVE", "AROUSAL"],
    EMOTION: ["COORDINATED", "BEHAVIOR"],
    SENTIMENT: ["SHARED", "NARRATIVES"],
  },
  CULTURE: {
    AFFECT: ["HISTORICAL", "TONE"],
    EMOTION: ["NORMALIZED", "RESPONSE"],
    SENTIMENT: ["IDEOLOGY", ""],
  },
};

export function AffectiveSystemsMatrix() {
  const VB_W = 400;
  const VB_H = 500;

  const headerY = 56;
  const matrixX = 70;
  const matrixY = 120;
  const matrixW = 300;
  const matrixH = 320;
  const colW = 75;
  const rowLabelW = matrixX - 10;
  const rowH = matrixH / ROWS.length;
  const headerRowH = 40;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-label="Affective Systems Matrix"
    >
      <rect x={0} y={0} width={VB_W} height={VB_H} fill="var(--ground)" />

      <text
        x={VB_W / 2}
        y={headerY}
        fill="var(--signal)"
        fontFamily="var(--font-orbitron), sans-serif"
        fontWeight={500}
        fontSize={16}
        letterSpacing="0.12em"
        textAnchor="middle"
      >
        AFFECTIVE SYSTEMS MATRIX
      </text>

      <text
        x={matrixX + matrixW / 2}
        y={matrixY - 22}
        fill="var(--signal)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={8}
        letterSpacing="0.14em"
        opacity={0.55}
        textAnchor="middle"
      >
        TEMPORAL RESOLUTION →
      </text>

      <text
        x={18}
        y={matrixY + matrixH / 2}
        fill="var(--signal)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={8}
        letterSpacing="0.14em"
        opacity={0.55}
        textAnchor="middle"
        transform={`rotate(-90, 18, ${matrixY + matrixH / 2})`}
      >
        ↑ SOCIAL SCALE
      </text>

      <rect
        x={matrixX}
        y={matrixY}
        width={matrixW}
        height={headerRowH}
        fill="none"
        stroke="rgba(245,245,243,0.32)"
        strokeWidth={0.6}
      />
      {COLUMNS.map((col, i) => (
        <text
          key={col}
          x={matrixX + (i + 0.5) * colW + 0}
          y={matrixY + headerRowH / 2 + 3}
          fill="var(--signal)"
          fontFamily="var(--font-orbitron), sans-serif"
          fontWeight={500}
          fontSize={10}
          letterSpacing="0.12em"
          textAnchor="middle"
        >
          {col}
        </text>
      ))}

      <rect
        x={matrixX}
        y={matrixY + headerRowH}
        width={matrixW}
        height={matrixH - headerRowH}
        fill="none"
        stroke="rgba(245,245,243,0.32)"
        strokeWidth={0.6}
      />

      {COLUMNS.slice(1).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={matrixX + (i + 1) * colW}
          y1={matrixY}
          x2={matrixX + (i + 1) * colW}
          y2={matrixY + matrixH}
          stroke="rgba(245,245,243,0.18)"
          strokeWidth={0.4}
        />
      ))}

      {ROWS.map((row, r) => {
        const y = matrixY + headerRowH + (r + 0.5) * ((matrixH - headerRowH) / ROWS.length);
        return (
          <g key={row}>
            <text
              x={matrixX - 8}
              y={y + 3}
              fill="var(--signal)"
              fontFamily="var(--font-orbitron), sans-serif"
              fontWeight={500}
              fontSize={9}
              letterSpacing="0.12em"
              textAnchor="end"
            >
              {row}
            </text>
            {COLUMNS.map((col, c) => {
              const [w1, w2] = CELLS[row][col];
              const cellX = matrixX + (c + 0.5) * colW;
              return (
                <g key={col}>
                  <text
                    x={cellX}
                    y={y - 3}
                    fill="var(--signal)"
                    fontFamily="var(--font-orbitron), sans-serif"
                    fontWeight={400}
                    fontSize={7.5}
                    letterSpacing="0.08em"
                    textAnchor="middle"
                  >
                    {w1}
                  </text>
                  {w2 && (
                    <text
                      x={cellX}
                      y={y + 8}
                      fill="var(--signal)"
                      fontFamily="var(--font-orbitron), sans-serif"
                      fontWeight={400}
                      fontSize={7.5}
                      letterSpacing="0.08em"
                      textAnchor="middle"
                    >
                      {w2}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}

      <g
        stroke="rgba(245,245,243,0.32)"
        strokeWidth={0.6}
        fill="none"
      >
        <line
          x1={matrixX + matrixW + 6}
          y1={matrixY - 14}
          x2={matrixX + matrixW + 24}
          y2={matrixY - 14}
        />
        <polygon
          points={`${matrixX + matrixW + 24},${matrixY - 17} ${matrixX + matrixW + 30},${matrixY - 14} ${matrixX + matrixW + 24},${matrixY - 11}`}
          fill="rgba(245,245,243,0.55)"
          stroke="none"
        />
        <line
          x1={matrixX - rowLabelW - 16}
          y1={matrixY + matrixH - 6}
          x2={matrixX - rowLabelW - 16}
          y2={matrixY + matrixH - 24}
        />
        <polygon
          points={`${matrixX - rowLabelW - 19},${matrixY + matrixH - 24} ${matrixX - rowLabelW - 16},${matrixY + matrixH - 30} ${matrixX - rowLabelW - 13},${matrixY + matrixH - 24}`}
          fill="rgba(245,245,243,0.55)"
          stroke="none"
        />
      </g>

      <text
        x={matrixX}
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
        x={matrixX + matrixW}
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
