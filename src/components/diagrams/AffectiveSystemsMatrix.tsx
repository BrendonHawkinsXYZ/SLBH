/* Affective Systems Matrix, FIG. 01
   Inline SVG poster. 4:5 ratio, dark register.
   4-col grid: row-label col + 3 data cols. 5-row grid: header + 4 data rows. */

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

  const MX = 40;
  const MY = 76;
  const CW = 80;           // all 4 cols equal (row-label + 3 data)
  const MW = CW * 4;       // 320
  const HDR_H = 44;
  const ROW_H = 78;
  const MH = HDR_H + ROW_H * 4;   // 356
  const MB = MY + MH;              // 432

  const rowLabelCX = MX + CW / 2;
  const colCX = (c: number) => MX + CW * (c + 1) + CW / 2;
  const hdrCY = MY + HDR_H / 2;
  const rowCY = (r: number) => MY + HDR_H + ROW_H * r + ROW_H / 2;

  const vDivX = [MX + CW, MX + CW * 2, MX + CW * 3];
  const hDivY = [
    MY + HDR_H + ROW_H,
    MY + HDR_H + ROW_H * 2,
    MY + HDR_H + ROW_H * 3,
  ];

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
        y={36}
        fill="var(--signal)"
        fontFamily="var(--font-orbitron), sans-serif"
        fontWeight={500}
        fontSize={14}
        letterSpacing="0.12em"
        textAnchor="middle"
      >
        AFFECTIVE SYSTEMS MATRIX
      </text>

      {/* Temporal resolution axis */}
      <text
        x={(MX + CW + MX + MW) / 2}
        y={62}
        fill="var(--signal)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={7}
        letterSpacing="0.14em"
        opacity={0.55}
        textAnchor="middle"
      >
        TEMPORAL RESOLUTION →
      </text>

      {/* Temporal arrow line */}
      <line
        x1={MX + CW + 6}
        y1={66}
        x2={MX + MW - 6}
        y2={66}
        stroke="rgba(245,245,243,0.28)"
        strokeWidth={0.5}
      />
      <polygon
        points={`${MX + MW - 6},${63.5} ${MX + MW},${66} ${MX + MW - 6},${68.5}`}
        fill="rgba(245,245,243,0.4)"
      />

      {/* Social scale axis rotated */}
      <text
        x={16}
        y={MY + MH / 2}
        fill="var(--signal)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={7}
        letterSpacing="0.14em"
        opacity={0.55}
        textAnchor="middle"
        transform={`rotate(-90, 16, ${MY + MH / 2})`}
      >
        SOCIAL SCALE
      </text>

      {/* Social scale arrow */}
      <line
        x1={27}
        y1={MB - 6}
        x2={27}
        y2={MY + 6}
        stroke="rgba(245,245,243,0.28)"
        strokeWidth={0.5}
      />
      <polygon
        points={`${24.5},${MY + 6} ${27},${MY} ${29.5},${MY + 6}`}
        fill="rgba(245,245,243,0.4)"
      />

      {/* Outer rect */}
      <rect
        x={MX}
        y={MY}
        width={MW}
        height={MH}
        fill="none"
        stroke="rgba(245,245,243,0.45)"
        strokeWidth={0.7}
      />

      {/* Vertical dividers */}
      {vDivX.map((x, i) => (
        <line
          key={`v-${i}`}
          x1={x}
          y1={MY}
          x2={x}
          y2={MB}
          stroke="rgba(245,245,243,0.22)"
          strokeWidth={0.4}
        />
      ))}

      {/* Header / data separator */}
      <line
        x1={MX}
        y1={MY + HDR_H}
        x2={MX + MW}
        y2={MY + HDR_H}
        stroke="rgba(245,245,243,0.45)"
        strokeWidth={0.5}
      />

      {/* Row dividers */}
      {hDivY.map((y, i) => (
        <line
          key={`h-${i}`}
          x1={MX}
          y1={y}
          x2={MX + MW}
          y2={y}
          stroke="rgba(245,245,243,0.18)"
          strokeWidth={0.3}
        />
      ))}

      {/* Column headers */}
      {COLUMNS.map((col, i) => (
        <text
          key={col}
          x={colCX(i)}
          y={hdrCY + 3.5}
          fill="var(--signal)"
          fontFamily="var(--font-orbitron), sans-serif"
          fontWeight={500}
          fontSize={9}
          letterSpacing="0.12em"
          textAnchor="middle"
        >
          {col}
        </text>
      ))}

      {/* Row labels + cell data */}
      {ROWS.map((row, r) => {
        const cy = rowCY(r);
        return (
          <g key={row}>
            <text
              x={rowLabelCX}
              y={cy + 3.5}
              fill="var(--signal)"
              fontFamily="var(--font-orbitron), sans-serif"
              fontWeight={400}
              fontSize={8}
              letterSpacing="0.1em"
              textAnchor="middle"
            >
              {row}
            </text>
            {COLUMNS.map((col, c) => {
              const [w1, w2] = CELLS[row][col];
              const cx = colCX(c);
              return (
                <g key={col}>
                  <text
                    x={cx}
                    y={w2 ? cy - 3 : cy + 3.5}
                    fill="var(--signal)"
                    fontFamily="var(--font-orbitron), sans-serif"
                    fontWeight={300}
                    fontSize={7}
                    letterSpacing="0.08em"
                    textAnchor="middle"
                  >
                    {w1}
                  </text>
                  {w2 && (
                    <text
                      x={cx}
                      y={cy + 9}
                      fill="var(--signal)"
                      fontFamily="var(--font-orbitron), sans-serif"
                      fontWeight={300}
                      fontSize={7}
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

      <text
        x={MX}
        y={VB_H - 28}
        fill="var(--signal)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={7.5}
        letterSpacing="0.14em"
        opacity={0.55}
      >
        AFFECTIVE COMPUTATIONAL GEOMETRY
      </text>
      <text
        x={MX + MW}
        y={VB_H - 28}
        fill="var(--signal)"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize={7.5}
        letterSpacing="0.14em"
        opacity={0.55}
        textAnchor="end"
      >
        STUDIO LAB BH
      </text>
    </svg>
  );
}
