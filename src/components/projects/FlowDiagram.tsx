type Stage = {
  primary: string;
  secondary?: string;
};

type Props = {
  stages: Stage[];
  ariaLabel: string;
};

const W = 138;
const H = 56;
const GAP = 22;
const ROW_H = 120;
const CY = ROW_H / 2;

/** Left-to-right stage flow, hairline register. Shared by the newer project pages. */
export function FlowDiagram({ stages, ariaLabel }: Props) {
  const totalW = stages.length * W + (stages.length - 1) * GAP;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${ROW_H}`}
      width="100%"
      aria-label={ariaLabel}
      style={{ display: "block", color: "currentColor" }}
    >
      <defs>
        <marker id="flow-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="currentColor" opacity="0.6" />
        </marker>
      </defs>

      {stages.map((s, i) => {
        const x = i * (W + GAP);
        return (
          <g key={i}>
            <rect
              x={x}
              y={CY - H / 2}
              width={W}
              height={H}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              opacity="0.5"
            />
            <text
              x={x + W / 2}
              y={s.secondary ? CY - 4 : CY + 3}
              textAnchor="middle"
              fontFamily="var(--font-plex-mono), 'IBM Plex Mono', monospace"
              fontSize="8.5"
              fill="currentColor"
              opacity="0.78"
              letterSpacing="0.08em"
            >
              {s.primary}
            </text>
            {s.secondary && (
              <text
                x={x + W / 2}
                y={CY + 11}
                textAnchor="middle"
                fontFamily="var(--font-plex-mono), 'IBM Plex Mono', monospace"
                fontSize="8.5"
                fill="currentColor"
                opacity="0.45"
                letterSpacing="0.08em"
              >
                {s.secondary}
              </text>
            )}
          </g>
        );
      })}

      {stages.slice(0, -1).map((_, i) => {
        const x1 = i * (W + GAP) + W + 1;
        const x2 = (i + 1) * (W + GAP) - 2;
        return (
          <line
            key={i}
            x1={x1}
            y1={CY}
            x2={x2}
            y2={CY}
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.4"
            markerEnd="url(#flow-arr)"
          />
        );
      })}
    </svg>
  );
}
