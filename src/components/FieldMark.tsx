import type { SVGProps } from "react";

export type FieldMarkSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<FieldMarkSize, number> = {
  xs: 14,
  sm: 18,
  md: 28,
  lg: 40,
  xl: 72,
};

type Props = {
  size?: FieldMarkSize;
  tone?: "ground" | "signal";
} & Omit<SVGProps<SVGSVGElement>, "width" | "height">;

export function FieldMark({
  size = "sm",
  tone,
  className = "",
  style,
  ...rest
}: Props) {
  const px = SIZE_MAP[size];
  const resolvedColor =
    tone === "signal"
      ? "var(--signal)"
      : tone === "ground"
      ? "var(--ground)"
      : "currentColor";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={px}
      height={px}
      fill={resolvedColor}
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path d="M20 3 L21.4 18.6 L37 20 L21.4 21.4 L20 37 L18.6 21.4 L3 20 L18.6 18.6 Z" />
    </svg>
  );
}
