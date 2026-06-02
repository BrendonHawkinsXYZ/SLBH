"use client";

import dynamic from "next/dynamic";

// Three.js touches the DOM and WebGL, so the scene is a client only module,
// loaded with ssr disabled; while it loads we hold a quiet dark cover so the
// light site chrome behind it never flashes through.
const FieldNotesScene = dynamic(() => import("./FieldNotesScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
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
        09 / FIELD NOTES
      </span>
    </div>
  ),
});

export default function FieldNotes() {
  return <FieldNotesScene />;
}
