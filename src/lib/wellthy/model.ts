export type Perspective = "member" | "specialist" | "provider" | "system";
export type CareType = "Childcare" | "Adult care" | "Pet care";
export type Phase = "draft" | "queued" | "review" | "matching" | "searching" | "selected" | "awaiting-member" | "confirmed" | "manual" | "unfilled";
export type Answer = "available" | "unavailable" | "clarification" | "withdrawn";
export type Scenario = "Happy path" | "Provider says no" | "No replies" | "Provider withdraws" | "Late reply";
export type CareRequest = { care: CareType; start: string; end: string; neighborhood: string; note: string };
export type Provider = { id: string; name: string; initials: string; care: CareType; experience: string; skills: string; distance: number; radius: number; hours: [number, number] | null; updated: string; wave: number };
export const providers: Provider[] = [
  { id: "avery", name: "Avery Morgan", initials: "AM", care: "Childcare", experience: "7 years of childcare", skills: "Ages 3–10 · CPR / first aid", distance: 1.2, radius: 4, hours: [14, 19], updated: "Today, 9:00 AM", wave: 1 },
  { id: "jordan", name: "Jordan Ellis", initials: "JE", care: "Childcare", experience: "5 years of childcare", skills: "Ages 4–12 · CPR / first aid", distance: 2.1, radius: 5, hours: null, updated: "Yesterday, 5:00 PM", wave: 1 },
  { id: "sam", name: "Sam Rivera", initials: "SR", care: "Childcare", experience: "6 years of childcare", skills: "Ages 2–12 · CPR / first aid", distance: 3.4, radius: 6, hours: [14, 20], updated: "Today, 10:30 AM", wave: 2 },
  { id: "nina", name: "Nina Patel", initials: "NP", care: "Adult care", experience: "8 years of adult care", skills: "Companionship · Meal preparation", distance: 1.5, radius: 5, hours: [12, 21], updated: "Today, 8:00 AM", wave: 1 },
  { id: "leo", name: "Leo Brooks", initials: "LB", care: "Childcare", experience: "4 years of childcare", skills: "Ages 3–10 · CPR / first aid", distance: 9, radius: 4, hours: [12, 20], updated: "Today, 8:30 AM", wave: 1 },
  { id: "eli", name: "Eli Park", initials: "EP", care: "Childcare", experience: "6 years of childcare", skills: "Ages 3–12 · CPR / first aid", distance: 1.8, radius: 5, hours: [14, 16], updated: "Today, 11:00 AM", wave: 1 },
  { id: "taylor", name: "Taylor Quinn", initials: "TQ", care: "Pet care", experience: "5 years of pet care", skills: "Dogs / cats · Feeding and walks", distance: 2, radius: 5, hours: [12, 21], updated: "Today, 9:30 AM", wave: 1 },
];
export const defaultRequest: CareRequest = { care: "Childcare", start: "15:00", end: "18:00", neighborhood: "Park Slope, Brooklyn", note: "One child, age 6. Playtime and an afternoon snack. CPR / first aid preferred." };
export function hour(value: string) { const [h, m] = value.split(":").map(Number); return h + m / 60; }
export function timeLabel(value: string) { const [h, m] = value.split(":").map(Number); return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h >= 12 ? "PM" : "AM"}`; }
export function careWindow(request: CareRequest) { return `Today, ${timeLabel(request.start)}–${timeLabel(request.end)}`; }
export function clockLabel(minute: number) { const total = 13 * 60 + 5 + minute; return `${Math.floor(total / 60) % 12 || 12}:${String(total % 60).padStart(2, "0")} PM`; }
export function matchProvider(provider: Provider, request: CareRequest) {
  const distance = provider.distance + (request.neighborhood.startsWith("Fort") ? 1 : request.neighborhood.startsWith("Prospect") ? .5 : 0);
  const reasons: string[] = [];
  if (provider.care !== request.care) reasons.push(`${provider.care} only`);
  if (distance > provider.radius) reasons.push(`${distance.toFixed(1)} mi exceeds ${provider.radius} mi travel preference`);
  if (provider.hours && (provider.hours[0] > hour(request.start) || provider.hours[1] < hour(request.end))) reasons.push("Known schedule does not cover the full care window");
  return { eligible: reasons.length === 0, reasons, distance, context: provider.hours ? "Schedule overlaps; fresh response required" : "Availability unknown; ask for this request" };
}
export type Response = { answer: Answer; minute: number; question?: string };
export type Event = { id: number; minute: number; actor: string; text: string };
export type DemoState = { phase: Phase; request: CareRequest; invited: string[]; excludedIds: string[]; sentAt: Record<string, number>; responses: Record<string, Response>; selectedId: string | null; events: Event[]; minute: number; wave: number; timedOut: boolean; clarification: Record<string, string>; rationale: string; scenario: string };
export function initialState(): DemoState { return { phase: "draft", request: { ...defaultRequest }, invited: [], excludedIds: [], sentAt: {}, responses: {}, selectedId: null, events: [], minute: 0, wave: 0, timedOut: false, clarification: {}, rationale: "", scenario: "Happy path" }; }
export type Action =
  | { type: "submit"; request: CareRequest }
  | { type: "open" | "match" | "outreach" | "timeout" | "expand" | "manual" | "resume" | "unfilled" | "provider-confirm" | "member-accept" | "member-decline" }
  | { type: "respond"; id: string; answer: Answer; question?: string }
  | { type: "select"; id: string; rationale: string }
  | { type: "clarify"; id: string; text: string }
  | { type: "reset" }
  | { type: "scenario"; scenario: Scenario };
function event(state: DemoState, patch: Partial<DemoState>, actor: string, text: string, elapsed = 1): DemoState {
  const minute = state.minute + elapsed;
  return { ...state, ...patch, minute, events: [...state.events, { id: state.events.length + 1, minute, actor, text }] };
}
function automateSearch(state: DemoState, request = state.request) {
  const eligible = providers.filter(p => !state.excludedIds.includes(p.id) && matchProvider(p, request).eligible);
  const invited = eligible.slice(0, 2).map(p => p.id);
  let next = event(state, { request, selectedId: null, responses: {}, invited: [], clarification: {}, rationale: "", timedOut: false }, "System", "Assigned request to Morgan Lee and checked care type, travel preferences and known schedules.");
  next = event(next, { phase: "searching", invited, sentAt: Object.fromEntries(invited.map(id => [id, next.minute + 1])), wave: 1 }, "System", `Automatically contacted ${invited.length} suitable caregiver${invited.length === 1 ? "" : "s"}. Awaiting request-specific availability.`);
  return next;
}
export function reducer(state: DemoState, action: Action): DemoState {
  if (action.type === "reset") return initialState();
  if (action.type === "scenario") {
    if (action.scenario === "Happy path") return initialState();
    let next = initialState();
    next = reducer(next, { type: "submit", request: defaultRequest });
    if (action.scenario === "Provider says no") {
      next = reducer(next, { type: "respond", id: "avery", answer: "available" });
      next = reducer(next, { type: "respond", id: "jordan", answer: "unavailable" });
    }
    else if (action.scenario === "No replies") next = reducer(next, { type: "timeout" });
    else {
      next = reducer(next, { type: "respond", id: "avery", answer: "available" });
      next = reducer(next, { type: "select", id: "avery", rationale: "Full care window, relevant experience, and travel fit." });
      if (action.scenario === "Provider withdraws") next = reducer(next, { type: "respond", id: "avery", answer: "withdrawn" });
      else { next = reducer(next, { type: "provider-confirm" }); next = reducer(next, { type: "member-accept" }); }
    }
    return { ...next, scenario: action.scenario };
  }
  switch (action.type) {
    case "submit":
      if (state.phase !== "draft" || hour(action.request.start) < 14 || hour(action.request.end) <= hour(action.request.start) || !action.request.note.trim()) return state;
      return automateSearch(event(state, { request: action.request }, "Member", "Casey submitted a same-day care request.", 0), action.request);
    case "open": return state.phase === "queued" ? event(state, { phase: "review" }, "Specialist", "Morgan opened and reviewed the request.") : state;
    case "match": return state.phase === "review" ? event(state, { phase: "matching" }, "System", "Applied simulated care, distance, travel and schedule rules.") : state;
    case "outreach": {
      if (state.phase !== "matching") return state;
      const invited = providers.filter(p => p.wave === 1 && matchProvider(p, state.request).eligible).slice(0, 2).map(p => p.id);
      return event(state, { phase: "searching", invited, sentAt: Object.fromEntries(invited.map(id => [id, state.minute + 1])), wave: 1 }, "Specialist", `Approved simulated outreach to ${invited.length} caregiver${invited.length === 1 ? "" : "s"}. No real messages sent.`);
    }
    case "respond": {
      if (!state.invited.includes(action.id) || !["searching", "selected", "awaiting-member", "confirmed"].includes(state.phase)) return state;
      const name = providers.find(p => p.id === action.id)!.name;
      const previous = state.responses[action.id];
      if (state.phase === "confirmed" && state.selectedId !== action.id) {
        if (state.events.some(e => e.text === `${name}: late reply received; returned current closed status.`)) return state;
        return event(state, {}, "System", `${name}: late reply received; returned current closed status.`);
      }
      if (previous?.answer === action.answer && previous.question === action.question) return state;
      if (state.phase === "confirmed" && action.answer !== "withdrawn") return state;
      const responses = { ...state.responses, [action.id]: { answer: action.answer, minute: state.minute + 1, question: action.question } };
      if (state.selectedId === action.id && action.answer !== "available") {
        const wasConfirmed = state.phase === "confirmed";
        const next = event(state, { responses: wasConfirmed ? {} : responses, phase: wasConfirmed ? "review" : "searching", selectedId: null, invited: wasConfirmed ? [] : state.invited, timedOut: false, rationale: "", clarification: wasConfirmed ? {} : state.clarification }, "Provider", `${name} ${action.answer === "withdrawn" ? "withdrew" : "changed availability"}. ${wasConfirmed ? "Confirmation revoked; all prior responses require a fresh check." : "Selection released; specialist must review another option."}`);
        return wasConfirmed ? automateSearch({ ...next, excludedIds: [...state.excludedIds, action.id] }) : next;
      }
      return event(state, { responses }, "Provider", `${name}: ${action.answer === "available" ? "interested and available for this window; not booked" : action.answer === "clarification" ? "needs clarification" : action.answer === "withdrawn" ? "withdrew availability" : "not available for this window"}.`);
    }
    case "select":
      if (state.phase !== "searching" || state.responses[action.id]?.answer !== "available" || !state.invited.includes(action.id) || !matchProvider(providers.find(p => p.id === action.id)!, state.request).eligible) return state;
      return event(state, { phase: "selected", selectedId: action.id, rationale: action.rationale }, "Specialist", `Selected ${providers.find(p => p.id === action.id)!.name}. ${action.rationale} Awaiting provider confirmation.`);
    case "provider-confirm":
      return state.phase === "selected" && state.selectedId && state.responses[state.selectedId]?.answer === "available" ? event(state, { phase: "awaiting-member" }, "Provider", "Selected caregiver confirmed the proposal. Member acceptance is still required.") : state;
    case "member-accept":
      return state.phase === "awaiting-member" ? event(state, { phase: "confirmed" }, "Member", "Casey accepted. Care confirmed; all other invited caregivers notified that the opportunity is closed.") : state;
    case "member-decline":
      return state.phase === "awaiting-member" && state.selectedId ? event(state, { phase: "searching", responses: { ...state.responses, [state.selectedId]: { answer: "withdrawn", minute: state.minute + 1 } }, selectedId: null, rationale: "" }, "Member", "Casey requested another option. Proposal released; specialist resumes coordination.") : state;
    case "timeout": {
      if (state.phase !== "searching" || state.timedOut) return state;
      let next = event(state, { timedOut: true }, "System", "Response window reached. Silence remains unknown; specialist alerted.", 10);
      const more = providers.filter(p => !state.invited.includes(p.id) && !state.excludedIds.includes(p.id) && matchProvider(p, state.request).eligible).map(p => p.id);
      if (more.length) next = event(next, { invited: [...next.invited, ...more], sentAt: { ...next.sentAt, ...Object.fromEntries(more.map(id => [id, next.minute + 1])) }, wave: 2 }, "System", `Automatically expanded outreach to ${more.map(id => providers.find(p => p.id === id)!.name).join(", ")}.`);
      return next;
    }
    case "expand": {
      if (state.phase !== "searching") return state;
      const more = providers.filter(p => !state.invited.includes(p.id) && matchProvider(p, state.request).eligible).map(p => p.id);
      return more.length ? event(state, { invited: [...state.invited, ...more], sentAt: { ...state.sentAt, ...Object.fromEntries(more.map(id => [id, state.minute + 1])) }, wave: 2, timedOut: false }, "Specialist", `Approved next cohort: ${more.map(id => providers.find(p => p.id === id)!.name).join(", ")}.`) : state;
    }
    case "manual": return ["searching", "matching", "review"].includes(state.phase) ? event(state, { phase: "manual" }, "Specialist", "Morgan took over manual coordination. Member informed; no care is promised.") : state;
    case "resume": return state.phase === "manual" ? automateSearch(event(state, {}, "Specialist", "Restarted automated search with a fresh availability check.")) : state;
    case "unfilled": return state.phase === "manual" ? event(state, { phase: "unfilled", selectedId: null }, "Specialist", "Closed unfilled. Member informed and all invited providers notified. Retained in pilot reporting.") : state;
    case "clarify":
      return state.responses[action.id]?.answer === "clarification" && action.text.trim() && ["searching", "selected"].includes(state.phase) ? event(state, { clarification: { ...state.clarification, [action.id]: action.text.trim() } }, "Specialist", `Replied to ${providers.find(p => p.id === action.id)!.name}: ${action.text.trim()}`) : state;
    default: return state;
  }
}
export const phaseLabel: Record<Phase, string> = { draft: "Ready when you are", queued: "Request received", review: "Specialist reviewing", matching: "Reviewing matches", searching: "Finding care", selected: "Provider selected", "awaiting-member": "Awaiting member acceptance", confirmed: "Care confirmed", manual: "Specialist coordinating", unfilled: "Closed · unfilled" };
