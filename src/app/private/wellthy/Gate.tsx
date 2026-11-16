"use client";

import { useActionState } from "react";
import { unlockDemo } from "./actions";
import styles from "./wellthy.module.css";

export function Gate() {
  const [state, action, pending] = useActionState(unlockDemo, { error: "" });
  return <div className={styles.app}>
    <header className={styles.topbar}><a className={styles.wordmark} href="/">Studio Lab BH</a><span>Private working session</span></header>
    <section className={styles.gate} aria-labelledby="gate-title">
      <div className={styles.gateMark} aria-hidden="true"><span /><span /><span /></div>
      <h1 id="gate-title"><span>Wellthy</span><br />Backup Care 2.0</h1>
      <p>Private interview prototype.</p>
      <form action={action} className={styles.gateForm}>
        <label htmlFor="password">Enter the session password</label>
        <div><input id="password" name="password" type="password" autoComplete="current-password" required maxLength={128} aria-describedby={state.error ? "gate-error" : undefined} /><button className={styles.primary} disabled={pending}>{pending ? "Opening…" : "Enter prototype →"}</button></div>
        {state.error && <p id="gate-error" role="alert" className={styles.error}>{state.error}</p>}
      </form>
      <p className={styles.caption}>By Brendon Hawkins · Studio Lab BH</p>
    </section>
  </div>;
}
