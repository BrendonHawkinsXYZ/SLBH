"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ChromaSignupForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "submitting") return;

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/chroma-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(result.error || "Unable to save your email.");

      setEmail("");
      setState("success");
      setMessage("YOU’LL BE NOTIFIED.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  };

  return (
    <div className="chroma-signup">
      <form className="chroma-signup-form" onSubmit={submit}>
        <input
          id="chroma-signup-email"
          className="chroma-signup-input"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="YOUR EMAIL"
          autoComplete="email"
          inputMode="email"
          aria-label="Email address"
          required
        />
        <input
          className="chroma-signup-trap"
          type="text"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button className="chroma-signup-submit" type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "SAVING…" : "GET NOTIFIED"}
        </button>
      </form>
      <p
        className={`chroma-signup-status ${state === "error" ? "is-error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>

      <style>{`
        .chroma-signup {
          width: min(100%, 680px);
          margin: 48px auto 0;
        }
        .chroma-signup-form {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          border: 1px solid rgba(245, 245, 243, 0.46);
          text-align: left;
        }
        .chroma-signup-input,
        .chroma-signup-submit {
          min-height: 58px;
          border: 0;
          border-radius: 0;
          font-family: var(--font-plex-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
        }
        .chroma-signup-input {
          min-width: 0;
          padding: 0 20px;
          outline: 0;
          background: transparent;
          color: var(--signal);
        }
        .chroma-signup-input::placeholder { color: rgba(245, 245, 243, 0.42); }
        .chroma-signup-input:focus {
          box-shadow: inset 0 0 0 1px var(--signal);
        }
        .chroma-signup-submit {
          padding: 0 24px;
          border-left: 1px solid rgba(245, 245, 243, 0.46);
          background: transparent;
          color: var(--signal);
          cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .chroma-signup-submit:hover:not(:disabled) {
          background: var(--signal);
          color: var(--ground);
        }
        .chroma-signup-submit:disabled { cursor: wait; opacity: 0.58; }
        .chroma-signup-trap {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }
        .chroma-signup-status {
          margin: 12px 0 0;
          font-family: var(--font-plex-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          color: rgba(245, 245, 243, 0.48);
        }
        .chroma-signup-status {
          min-height: 1.4em;
          color: rgba(245, 245, 243, 0.78);
        }
        .chroma-signup-status.is-error { color: #ff8d8d; }
        @media (max-width: 639px) {
          .chroma-signup-form { grid-template-columns: 1fr; }
          .chroma-signup-submit { border-top: 1px solid rgba(245, 245, 243, 0.46); border-left: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .chroma-signup-submit { transition: none; }
        }
      `}</style>
    </div>
  );
}
