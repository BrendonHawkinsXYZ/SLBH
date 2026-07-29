type Props = {
  label?: string;
  stages: string[];
  footnote?: string;
  ariaLabel: string;
};

/** Vertical stage stack in a hairline panel — the system-overview register. */
export function StackDiagram({ label, stages, footnote, ariaLabel }: Props) {
  return (
    <div className="stk" role="img" aria-label={ariaLabel}>
      {label && <p className="t-mono stk-label">{label}</p>}
      <ol className="stk-list">
        {stages.map((stage, i) => (
          <li key={stage} className="stk-item">
            <div className="t-mono stk-box">{stage}</div>
            {i < stages.length - 1 && (
              <span className="stk-arrow" aria-hidden>
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
      {footnote && <p className="t-mono stk-foot">{footnote}</p>}

      <style>{`
        .stk {
          border: 0.5px solid var(--hairline-strong);
          padding: 24px;
          width: 100%;
          box-sizing: border-box;
        }
        .stk-label {
          margin: 0 0 20px;
          font-size: 10px;
          letter-spacing: 0.14em;
          opacity: 0.45;
        }
        .stk-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .stk-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stk-box {
          border: 0.5px solid var(--hairline-strong);
          padding: 14px 16px;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          font-size: 10px;
          letter-spacing: 0.12em;
          opacity: 0.78;
        }
        .stk-arrow {
          font-family: var(--font-plex-mono), ui-monospace, monospace;
          font-size: 11px;
          line-height: 1;
          padding: 10px 0;
          opacity: 0.4;
        }
        .stk-foot {
          margin: 20px 0 0;
          text-align: center;
          font-size: 9px;
          letter-spacing: 0.12em;
          opacity: 0.45;
        }
      `}</style>
    </div>
  );
}
