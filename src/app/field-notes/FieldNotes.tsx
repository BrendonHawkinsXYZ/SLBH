"use client";

import dynamic from "next/dynamic";

// Three.js touches the DOM and WebGL, so the scene is a client only module,
// loaded with ssr disabled; while it loads we hold a quiet dark block in the
// normal page flow, so the site nav and status bar sit above it as on every
// other page.
const FieldNotesScene = dynamic(() => import("./FieldNotesScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100svh - 112px)",
        minHeight: 460,
        background: "#0B0B0F",
        color: "#F2F2F2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        className="t-mono"
        style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.5 }}
      >
        05 / FIELD NOTES
      </span>
    </div>
  ),
});

export default function FieldNotes() {
  return <FieldNotesScene />;
}
