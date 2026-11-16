import assert from "node:assert/strict";
import { test } from "node:test";
import { defaultRequest, initialState, matchProvider, providers, reducer } from "../src/lib/wellthy/model.ts";

const apply = (state, ...actions) => actions.reduce(reducer, state);
const search = () => reducer(initialState(), { type: "submit", request: defaultRequest });
const available = () => reducer(search(), { type: "respond", id: "avery", answer: "available" });
const selected = () => reducer(available(), { type: "select", id: "avery", rationale: "Relevant experience and full window." });
const confirmed = () => apply(selected(), { type: "provider-confirm" }, { type: "member-accept" });

test("confirmation requires fresh interest, specialist choice, provider confirmation, and member acceptance", () => {
  let state = search();
  assert.deepEqual(state.invited, ["avery", "jordan"]);
  assert.equal(reducer(state, { type: "select", id: "avery", rationale: "" }), state);
  assert.equal(reducer(state, { type: "member-accept" }), state);
  state = reducer(state, { type: "respond", id: "avery", answer: "available" });
  assert.equal(state.phase, "searching");
  state = reducer(state, { type: "select", id: "avery", rationale: "Fit" });
  assert.equal(state.phase, "selected");
  assert.equal(reducer(state, { type: "member-accept" }), state);
  state = reducer(state, { type: "provider-confirm" });
  assert.equal(state.phase, "awaiting-member");
  state = reducer(state, { type: "member-accept" });
  assert.equal(state.phase, "confirmed");
  assert.equal(reducer(state, { type: "member-accept" }), state);
  assert.equal(state.events.filter(e => e.text.includes("Casey accepted")).length, 1);
});
test("duplicates, uninvited responses and out-of-order confirmations cannot create commitments", () => {
  const state = available();
  for (const action of [{ type: "respond", id: "avery", answer: "available" }, { type: "respond", id: "sam", answer: "available" }, { type: "provider-confirm" }]) assert.equal(reducer(state, action), state);
  const chosen = selected();
  assert.equal(reducer(chosen, { type: "select", id: "jordan", rationale: "" }), chosen);
});
test("no response stays unknown; automatic next cohort retains the same care request with a fresh outreach timestamp", () => {
  let state = reducer(search(), { type: "timeout" });
  assert.equal(state.timedOut, true);
  assert.deepEqual(state.responses, {});
  assert.equal(state.minute, 13);
  assert.deepEqual(state.invited, ["avery", "jordan", "sam"]);
  assert.equal(state.sentAt.sam, 13);
  assert.equal(state.sentAt.avery, 2);
  assert.equal(state.request, defaultRequest);
});
test("withdrawal releases selection, and a confirmed cancellation invalidates closed or stale responses", () => {
  let state = reducer(selected(), { type: "respond", id: "avery", answer: "withdrawn" });
  assert.equal(state.phase, "searching");
  assert.equal(state.selectedId, null);
  assert.equal(reducer(state, { type: "provider-confirm" }), state);
  state = reducer(confirmed(), { type: "respond", id: "avery", answer: "withdrawn" });
  assert.equal(state.phase, "searching");
  assert.equal(state.selectedId, null);
  assert.deepEqual(state.responses, {});
  assert.deepEqual(state.invited, ["jordan", "sam"]);
});
test("a late reply returns closure once without reopening or replacing the confirmed caregiver", () => {
  let state = confirmed();
  state = reducer(state, { type: "respond", id: "jordan", answer: "available" });
  assert.equal(state.phase, "confirmed");
  assert.equal(state.selectedId, "avery");
  assert.equal(state.responses.jordan, undefined);
  assert.equal(reducer(state, { type: "respond", id: "jordan", answer: "available" }), state);
});
test("clarification remains unselectable until a fresh availability response", () => {
  let state = reducer(search(), { type: "respond", id: "avery", answer: "clarification", question: "Is a walk needed?" });
  state = reducer(state, { type: "clarify", id: "avery", text: "Indoor play only." });
  assert.equal(state.clarification.avery, "Indoor play only.");
  assert.equal(reducer(state, { type: "select", id: "avery", rationale: "" }), state);
  state = reducer(state, { type: "respond", id: "avery", answer: "available" });
  assert.equal(state.responses.avery.minute, 5);
  assert.equal(reducer(state, { type: "select", id: "avery", rationale: "Fit" }).phase, "selected");
});
test("member rejection and manual fallback preserve a path to another decision", () => {
  const state = apply(selected(), { type: "provider-confirm" }, { type: "member-decline" });
  assert.equal(state.phase, "searching");
  assert.equal(state.selectedId, null);
  const manual = reducer(state, { type: "manual" });
  assert.equal(manual.phase, "manual");
  assert.equal(reducer(manual, { type: "unfilled" }).phase, "unfilled");
  const resumed = reducer(manual, { type: "resume" });
  assert.equal(resumed.phase, "searching");
  assert.deepEqual(resumed.responses, {});
});
test("rules exclude wrong care, excessive travel, and incomplete schedules while keeping unknown availability explicit", () => {
  const results = Object.fromEntries(providers.map(p => [p.id, matchProvider(p, defaultRequest)]));
  assert.equal(results.nina.eligible, false);
  assert.equal(results.leo.eligible, false);
  assert.equal(results.eli.eligible, false);
  assert.equal(results.jordan.eligible, true);
  assert.match(results.jordan.context, /unknown/);
  for (const care of ["Adult care", "Pet care"]) assert.equal(providers.filter(p => matchProvider(p, { ...defaultRequest, care }).eligible).length, 1);
});
test("scenario presets and reset remain deterministic", () => {
  for (const [scenario, phase] of [["Provider says no", "searching"], ["No replies", "searching"], ["Provider withdraws", "searching"], ["Late reply", "confirmed"]]) {
    const state = reducer(initialState(), { type: "scenario", scenario });
    assert.equal(state.phase, phase);
    assert.equal(state.scenario, scenario);
    assert.deepEqual(reducer(state, { type: "reset" }), initialState());
  }
});
test("invalid care windows never enter the queue", () => {
  const state = initialState();
  for (const request of [{ ...defaultRequest, end: "14:00" }, { ...defaultRequest, start: "12:00" }, { ...defaultRequest, note: " " }]) assert.equal(reducer(state, { type: "submit", request }), state);
});
