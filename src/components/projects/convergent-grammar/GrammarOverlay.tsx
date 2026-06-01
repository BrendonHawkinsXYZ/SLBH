/**
 * GrammarOverlay — hairline-vector tracing of a composition's spatial grammar.
 *
 * Each variant approximates the geometric relationships a different image genre
 * is built to solve: portrait axis, landscape horizon, interior perspective,
 * figure contrapposto, garment drape, thirds lattice. Drawn over a graphite
 * ground (and, once present, a source image) to evoke the extracted grammar
 * the project compares across its corpus.
 *
 * preserveAspectRatio="none" lets the grammar fill any cell aspect; every
 * stroke uses non-scaling-stroke so the hairlines stay crisp at 1px.
 */

type Props = {
  variant: number;
  className?: string;
};

const VEC = "rgba(243, 242, 242, 0.42)";
const VEC_FAINT = "rgba(243, 242, 242, 0.22)";
const FOCAL = "rgba(243, 242, 242, 0.78)";

function Seg({
  x1,
  y1,
  x2,
  y2,
  faint,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  faint?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={faint ? VEC_FAINT : VEC}
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  );
}

function Cross({ x, y, s = 5 }: { x: number; y: number; s?: number }) {
  return (
    <g stroke={FOCAL} strokeWidth="1" vectorEffect="non-scaling-stroke">
      <line x1={x - s} y1={y} x2={x + s} y2={y} vectorEffect="non-scaling-stroke" />
      <line x1={x} y1={y - s} x2={x} y2={y + s} vectorEffect="non-scaling-stroke" />
    </g>
  );
}

function variantGeometry(v: number) {
  switch (((v % 6) + 6) % 6) {
    case 0: // PORTRAIT — central axis, eye-line, shoulders
      return (
        <>
          <Seg x1={50} y1={6} x2={50} y2={100} />
          <Seg x1={18} y1={36} x2={82} y2={36} faint />
          <Seg x1={28} y1={100} x2={50} y2={60} />
          <Seg x1={72} y1={100} x2={50} y2={60} />
          <Cross x={50} y={36} />
        </>
      );
    case 1: // LANDSCAPE — horizon, thirds, lead-in
      return (
        <>
          <Seg x1={0} y1={64} x2={100} y2={64} />
          <Seg x1={33} y1={0} x2={33} y2={100} faint />
          <Seg x1={67} y1={0} x2={67} y2={100} faint />
          <Seg x1={4} y1={100} x2={67} y2={64} />
          <Cross x={67} y={64} />
        </>
      );
    case 2: // INTERIOR — one-point perspective to a vanishing point
      return (
        <>
          <Seg x1={0} y1={18} x2={100} y2={18} faint />
          <Seg x1={0} y1={80} x2={100} y2={80} faint />
          <Seg x1={0} y1={0} x2={54} y2={46} />
          <Seg x1={100} y1={0} x2={54} y2={46} />
          <Seg x1={0} y1={100} x2={54} y2={46} />
          <Seg x1={100} y1={100} x2={54} y2={46} />
          <Cross x={54} y={46} />
        </>
      );
    case 3: // FIGURE — contrapposto axis, shoulder + hip lines, masses
      return (
        <>
          <Seg x1={40} y1={8} x2={58} y2={98} />
          <Seg x1={34} y1={34} x2={64} y2={28} />
          <Seg x1={40} y1={62} x2={66} y2={66} />
          <Cross x={49} y={30} />
          <Cross x={53} y={64} />
        </>
      );
    case 4: // GARMENT — drape verticals, neckline, hem
      return (
        <>
          <Seg x1={40} y1={26} x2={40} y2={96} />
          <Seg x1={50} y1={20} x2={50} y2={98} />
          <Seg x1={60} y1={26} x2={60} y2={96} />
          <Seg x1={40} y1={26} x2={50} y2={20} faint />
          <Seg x1={60} y1={26} x2={50} y2={20} faint />
          <Seg x1={38} y1={92} x2={62} y2={92} faint />
          <Cross x={50} y={20} />
        </>
      );
    default: // 5 — THIRDS lattice
      return (
        <>
          <Seg x1={33} y1={0} x2={33} y2={100} faint />
          <Seg x1={67} y1={0} x2={67} y2={100} faint />
          <Seg x1={0} y1={33} x2={100} y2={33} faint />
          <Seg x1={0} y1={67} x2={100} y2={67} faint />
          <Cross x={33} y={33} s={4} />
          <Cross x={67} y={33} s={4} />
          <Cross x={33} y={67} s={4} />
          <Cross x={67} y={67} s={4} />
        </>
      );
  }
}

export function GrammarOverlay({ variant, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {variantGeometry(variant)}
    </svg>
  );
}
