import { GATED_PATH, safeNext } from "@/lib/gate";

export const metadata = {
  title: "Protected — SLBH",
  robots: { index: false, follow: false },
};

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next ?? GATED_PATH);
  const failed = params.error === "1";

  return (
    <section className="container-page unl-section">
      <div className="unl-panel">
        <p className="t-mono unl-kicker">SLBH / v2.0 / PROTECTED</p>
        <h1 className="t-h1 unl-title">Not open yet.</h1>
        <p className="t-body unl-body">
          This page is live but still being built. Enter the password to view it.
        </p>

        <form method="POST" action="/api/unlock" className="unl-form">
          <input type="hidden" name="next" value={next} />
          <label className="t-label unl-label" htmlFor="password">
            PASSWORD
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            className="t-mono unl-input"
          />
          {failed && (
            <p className="t-mono unl-error" role="alert">
              INCORRECT PASSWORD
            </p>
          )}
          <button type="submit" className="t-nav unl-submit">
            Enter
          </button>
        </form>
      </div>

      <style>{`
        .unl-section {
          padding-top: 96px;
          padding-bottom: 160px;
          display: flex;
          justify-content: center;
        }
        .unl-panel { width: 100%; max-width: 420px; }
        .unl-kicker { opacity: 0.55; margin: 0 0 20px; }
        .unl-title { margin: 0 0 20px; }
        .unl-body {
          margin: 0 0 40px;
          line-height: 1.7;
          opacity: 0.72;
        }
        .unl-form { display: flex; flex-direction: column; }
        .unl-label {
          opacity: 0.55;
          letter-spacing: 0.18em;
          margin-bottom: 12px;
        }
        .unl-input {
          appearance: none;
          background: transparent;
          border: 0.5px solid var(--hairline-strong);
          border-radius: 0;
          color: var(--ground);
          font-size: 13px;
          letter-spacing: 0.12em;
          padding: 14px 16px;
          width: 100%;
          box-sizing: border-box;
        }
        .unl-input:focus-visible {
          outline: none;
          border-color: var(--ground);
        }
        .unl-error {
          margin: 14px 0 0;
          color: var(--signal-red);
          font-size: 10px;
          letter-spacing: 0.14em;
        }
        .unl-submit {
          margin-top: 28px;
          align-self: flex-start;
          background: transparent;
          border: 1px solid var(--ground);
          border-radius: 0;
          color: var(--ground);
          cursor: pointer;
          padding: 14px 32px;
        }
        .unl-submit:hover { opacity: 0.72; }
      `}</style>
    </section>
  );
}
