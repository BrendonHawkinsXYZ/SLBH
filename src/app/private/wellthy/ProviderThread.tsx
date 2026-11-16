"use client";

import { useEffect, useRef, useState } from "react";
import { clockLabel, timeLabel, providers, type DemoState, type Perspective, type reducer } from "@/lib/wellthy/model";
import s from "./wellthy.module.css";

type Props = { state: DemoState; dispatch: React.Dispatch<Parameters<typeof reducer>[1]>; go: (view: Perspective, id?: string) => void; providerId: string; setProviderId: (id: string) => void };

export function ProviderThread({ state, dispatch, go, providerId, setProviderId }: Props) {
  const provider = providers.find(p => p.id === providerId)!;
  const response = state.responses[providerId];
  const selected = state.selectedId === providerId;
  const cancelled = state.excludedIds.includes(providerId);
  const invited = state.invited.includes(providerId) || cancelled;
  const closed = cancelled || state.phase === "unfilled" || state.phase === "confirmed" && !selected;
  const [draft, setDraft] = useState("");
  const [lateReply, setLateReply] = useState("");
  const [error, setError] = useState("");
  const thread = useRef<HTMLDivElement>(null);
  const window = `${timeLabel(state.request.start)}–${timeLabel(state.request.end)}`;
  useEffect(() => { const element = thread.current; if (element) element.scrollTop = element.scrollHeight; }, [state.events.length, lateReply, providerId]);
  useEffect(() => { setDraft(""); setLateReply(""); setError(""); }, [providerId]);
  function send(value: string) {
    const text = value.trim();
    if (!text) return;
    setError("");
    if (selected && state.phase === "confirmed" && !["CANCEL", "WITHDRAW"].includes(text.toUpperCase())) { setError("Reply CANCEL if your availability has changed."); return; }
    if (closed) {
      setLateReply(text);
      if (state.phase === "confirmed") dispatch({ type: "respond", id: providerId, answer: text.toUpperCase() === "NO" ? "unavailable" : "available" });
    } else if (text.toUpperCase() === "CONFIRM") {
      if (!selected || state.phase !== "selected") { setError("Reply YES or NO to share your availability first."); return; }
      dispatch({ type: "provider-confirm" });
    } else if (text.toUpperCase() === "YES") dispatch({ type: "respond", id: providerId, answer: "available" });
    else if (text.toUpperCase() === "NO") dispatch({ type: "respond", id: providerId, answer: "unavailable" });
    else if (["WITHDRAW", "CANCEL"].includes(text.toUpperCase())) dispatch({ type: "respond", id: providerId, answer: "withdrawn" });
    else dispatch({ type: "respond", id: providerId, answer: "clarification", question: text });
    setDraft("");
  }
  const canReply = invited && ["searching", "selected", "awaiting-member", "confirmed", "unfilled"].includes(state.phase);
  return <div className={s.providerView}>
    <div className={s.viewTitle}><h2>Provider messages</h2><label>View as<select value={providerId} onChange={e => setProviderId(e.target.value)}>{providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div>
    <section className={`${s.phone} ${s.messagePhone}`} aria-label={`${provider.name}’s message thread`}>
      <header className={s.messageHeader}><span className={s.messageBack} aria-hidden="true">‹</span><div className={s.messageContact}><span className={s.messageAvatar} aria-hidden="true">W</span><strong>Wellthy Backup Care <span aria-hidden="true">›</span></strong></div></header>
      <div className={s.thread} ref={thread}>
        {!invited ? <div className={s.phoneEmpty}><h3>No request yet</h3><p className={s.subtle}>{state.phase === "draft" ? "Submit a member request to start." : "This caregiver hasn’t been contacted."}</p><button className={s.secondary} onClick={() => go(state.phase === "draft" ? "member" : "system")}>Go to {state.phase === "draft" ? "Member" : "System"} →</button></div> : <>
          <span className={s.threadDate}>Today {clockLabel(state.sentAt[providerId] ?? 2)}</span>
          <div className={s.incoming}><p>Hi {provider.name.split(" ")[0]}, a family needs {state.request.care.toLowerCase()} today.</p><p><strong>{window}</strong><br />{state.request.neighborhood}<br />$28/hour</p><p>{state.request.note}</p><p>Reply <strong>YES</strong> if you’re available or <strong>NO</strong> if you’re not. YES means interested, not booked.</p></div>
          {response && <><div className={s.outgoing}>{response.answer === "available" ? "YES" : response.answer === "unavailable" ? "NO" : response.answer === "withdrawn" ? "WITHDRAW" : response.question}</div><span className={s.sentTime}>{clockLabel(response.minute)}</span>
            <div className={s.incoming}><p>{response.answer === "available" ? "Thanks! We’ve let our specialist team know you’re available. We’ll follow up shortly with more information. You’re not booked yet." : response.answer === "unavailable" ? "Thanks for letting us know. We’ve marked you unavailable for this request and will continue looking. This only applies to today’s care window." : response.answer === "withdrawn" ? "Your availability has been withdrawn. Our specialist team has been notified." : "We’ve sent your question to our specialist team. They’ll follow up here."}</p></div>
          </>}
          {state.clarification[providerId] && <div className={s.incoming}><p>{state.clarification[providerId]}</p><p>Does that work? Reply YES or NO.</p></div>}
          {selected && ["selected", "awaiting-member", "confirmed"].includes(state.phase) && <div className={s.incoming}><p>Morgan would like to propose you for Casey’s care today, {window}, in {state.request.neighborhood}.</p><p>Reply <strong>CONFIRM</strong> if you can commit. Casey will then review and accept.</p></div>}
          {selected && ["awaiting-member", "confirmed"].includes(state.phase) && <><div className={s.outgoing}>CONFIRM</div><div className={s.incoming}><p>Thank you. We’re checking with Casey now and will send your booking confirmation once they accept.</p></div></>}
          {selected && state.phase === "confirmed" && <div className={s.incoming}><p><strong>You’re booked!</strong></p><p>Casey has accepted. Your {state.request.care.toLowerCase()} booking is confirmed.</p><p>Today, {window}<br />{state.request.neighborhood}<br />$28/hour</p><p>If your availability changes, reply CANCEL so our specialist team can help.</p></div>}
          {cancelled && <><div className={s.outgoing}>CANCEL</div><div className={s.incoming}><p>Your booking has been cancelled. We’ve notified our specialist team and Casey, and we’re finding another caregiver.</p></div></>}
          {closed && !cancelled && <div className={s.incoming}><p>{state.phase === "unfilled" ? "This search has closed." : "This opportunity has been filled by another caregiver."} You are not booked. Thank you for considering it.</p></div>}
          {lateReply && <><div className={s.outgoing}>{lateReply}</div><div className={s.incoming} role="status"><p>Thanks for replying. This opportunity is already closed, so we haven’t added you to this booking.</p></div></>}
        </>}
      </div>
      {canReply && <div className={s.messageControls}>
        <div className={s.suggestedReplies} aria-label="Suggested replies">
          {selected && state.phase === "selected" ? <button onClick={() => send("CONFIRM")}>CONFIRM</button> : state.phase !== "confirmed" || closed ? <><button onClick={() => send("YES")} disabled={!closed && response?.answer === "available"}>YES</button><button onClick={() => send("NO")} disabled={!closed && response?.answer === "unavailable"}>NO</button></> : null}
          {response?.answer === "available" && !closed && <button onClick={() => send("WITHDRAW")}>Withdraw</button>}
        </div>
        <form className={s.messageComposer} onSubmit={e => { e.preventDefault(); send(draft); }}><label className={s.srOnly} htmlFor="message-reply">Message reply</label><input id="message-reply" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Text message" autoComplete="off" maxLength={300} /><button type="submit" aria-label="Send message" disabled={!draft.trim()}>↑</button></form>
        {error && <p className={s.error} role="alert">{error}</p>}
      </div>}
      <div className={s.homeIndicator} aria-hidden="true" />
    </section>
    {selected && state.phase === "awaiting-member" && <div className={s.threadHandoff}><button className={s.textButton} onClick={() => go("member")}>Continue as Member →</button></div>}
  </div>;
}
