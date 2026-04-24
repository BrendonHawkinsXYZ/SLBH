import type { ReactNode } from "react";

type Props = {
  pageName: string;
  readout?: ReactNode;
  pillars?: string;
};

export function MonoReadout({
  pageName,
  readout,
  pillars = "AFFECT · SYSTEMS · DATA · TIME",
}: Props) {
  return (
    <div
      className="container-page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        padding: "28px var(--pad-x-mobile)",
      }}
    >
      <span className="t-mono" style={{ opacity: 0.55 }}>
        SLBH / v2.0 / {pageName.toUpperCase()}
      </span>
      <span
        className="t-label"
        style={{ opacity: 0.55, letterSpacing: "0.18em" }}
      >
        {pillars}
      </span>
      <span className="t-mono" style={{ opacity: 0.55, minWidth: 120, textAlign: "right" }}>
        {readout ?? ""}
      </span>
    </div>
  );
}
