/* Chroma Data Model, FIG. 02
   Inline SVG poster. 4:5 ratio, dark register.
   Vertical flow: DATA SIGNAL → transformation chamber → AFFECTIVE READOUT. */

export function ChromaDataModel() {
  const VB_W = 400;
  const VB_H = 500;
  const centerX = VB_W / 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-label="Chroma Data Model"
    >
      <rect x={0} y={0} width={VB_W} height={VB_H} fill="var(--ground)" />

      <text
        x={centerX}
        y={54}
        fill="var(--signal)"
        fontFamily="var(--font-orbitron), sans-serif"
        fontWeight={500}
        fontSize={16}
        letterSpacing="0.12em"
        textAnchor="middle"
      >
        CHROMA DATA MODEL
      </text>

      <text
        x={centerX}
        y={130}
        fill="var(--signal)"
        fontFamily="var(--font-orbitron), sans-serif"
        fontWeight={500}
        fontSize={13}
        letterSpacing="0.12em"
        textAnchor="middle"
      >
        DATA SIGNAL
      </text>

      <g stroke="var(--signal)" strokeWidth={1.1} fill="none">
        <line x1={centerX} y1={148} x2={centerX} y2={198} />
        <polygon
          points={`${centerX - 5},${194} ${centerX + 5},${194} ${centerX},${204}`}
          fill="var(--signal)"
          stroke="none"
        />
      </g>

      <circle
        cx={centerX}
        cy={278}
        r={75}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={1}
      />

      {[
        { label: "CLEANSING", dy: -18 },
        { label: "VECTORIZING", dy: 0 },
        { label: "ASSIGNING", dy: 18 },
      ].map((line) => (
        <text
          key={line.label}
          x={centerX}
          y={278 + line.dy}
          fill="var(--signal)"
          fontFamily="var(--font-orbitron), sans-serif"
          fontWeight={400}
          fontSize={11}
          letterSpacing="0.1em"
          textAnchor="middle"
        >
          {line.label}
        </text>
      ))}

      <g stroke="var(--signal)" strokeWidth={1.1} fill="none">
        <line x1={centerX} y1={357} x2={centerX} y2={398} />
        <polygon
          points={`${centerX - 5},${394} ${centerX + 5},${394} ${centerX},${404}`}
          fill="var(--signal)"
          stroke="none"
        />
      </g>

      <text
        x={centerX}
        y={425}
        fill="var(--signal)"
        fontFamily="var(--font-orbitron), sans-serif"
        fontWeight={500}
        fontSize={13}
        letterSpacing="0.12em"
        textAnchor="middle"
      >
        AFFECTIVE READOUT
      </text>

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
