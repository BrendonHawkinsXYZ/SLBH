export function PipelineDiagram() {
  const boxes = [
    { x: 8,   labels: ["GOOGLE TRENDS", "RSS"] },
    { x: 178, labels: ["GPT-4o", "EMOTION SCORING"] },
    { x: 348, labels: ["171-EMOTION", "TAXONOMY + COLOR"] },
    { x: 518, labels: ["LUMINOUS FIELD", "RENDER"] },
  ];
  const W = 114;
  const H = 56;
  const CY = 60;

  return (
    <svg
      viewBox="0 0 640 120"
      width="100%"
      aria-label="Pipeline: Google Trends RSS → GPT-4o Emotion Scoring → 171-Emotion Taxonomy + Free Color → Luminous Field Render"
      style={{ display: "block", color: "currentColor" }}
    >
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="currentColor" opacity="0.6" />
        </marker>
      </defs>

      {boxes.map(({ x, labels }, i) => (
        <g key={i}>
          <rect
            x={x} y={CY - H / 2}
            width={W} height={H}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.5"
          />
          <text
            x={x + W / 2} y={CY - 6}
            textAnchor="middle"
            fontFamily="var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace"
            fontSize="8.5"
            fill="currentColor"
            opacity="0.72"
            letterSpacing="0.08em"
          >
            {labels[0]}
          </text>
          <text
            x={x + W / 2} y={CY + 10}
            textAnchor="middle"
            fontFamily="var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace"
            fontSize="8.5"
            fill="currentColor"
            opacity="0.45"
            letterSpacing="0.08em"
          >
            {labels[1]}
          </text>
        </g>
      ))}

      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={boxes[i].x + W + 1}
          y1={CY}
          x2={boxes[i + 1].x - 2}
          y2={CY}
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.4"
          markerEnd="url(#arr)"
        />
      ))}
    </svg>
  );
}
