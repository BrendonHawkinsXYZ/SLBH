type NodePosition = "top" | "bottom" | "both" | "none";

type Props = {
  length?: number;
  nodePosition?: NodePosition;
  className?: string;
};

export function TrunkLine({
  length = 110,
  nodePosition = "bottom",
  className = "",
}: Props) {
  const width = 7;
  const cx = width / 2;
  const showTop = nodePosition === "top" || nodePosition === "both";
  const showBottom = nodePosition === "bottom" || nodePosition === "both";
  const nodeR = 3.5;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={length}
      viewBox={`0 0 ${width} ${length}`}
      aria-hidden
      className={className}
    >
      <line
        x1={cx}
        y1={showTop ? nodeR : 0}
        x2={cx}
        y2={showBottom ? length - nodeR : length}
        stroke="var(--ground)"
        strokeWidth={1}
      />
      {showTop && <circle cx={cx} cy={nodeR} r={nodeR} fill="var(--ground)" />}
      {showBottom && (
        <circle cx={cx} cy={length - nodeR} r={nodeR} fill="var(--ground)" />
      )}
    </svg>
  );
}
