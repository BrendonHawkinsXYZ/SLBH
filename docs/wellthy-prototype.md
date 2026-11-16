# Wellthy Backup Care interview prototype

Unlisted route: `/private/wellthy`. It is excluded from indexing and the sitemap. The page checks an HTTP-only, same-site server-validated session before rendering the prototype. The shared password is provided separately, not stored in this document or client source. Sessions last eight hours; **Lock** clears the session. An optional `WELLTHY_DEMO_PASSWORD` server environment variable replaces the default password and invalidates existing sessions.

Run `npm run dev`, then open `http://localhost:3000/private/wellthy`. No accounts, API keys, messaging services, payments, or extra dependencies are needed. All care data is simulated and held in page memory. Reloading resets the request; switching perspectives preserves it.

## Four-minute walkthrough

1. **Member:** Submit the prefilled childcare request for today, 3–6 PM.
2. **System:** Show automatic assignment, matching, and outreach to two caregivers. There is no specialist contact-selection or outreach-approval step. Matching decisions and activity can be expanded if needed.
3. **Provider:** As Avery, send **YES** using the suggested reply or message field. The acknowledgment tells the caregiver the specialist team has been notified. This is request-specific interest, not a booking.
4. **Specialist:** Review Avery’s current response and select the caregiver.
5. **Provider:** Send **CONFIRM** to commit to the proposal.
6. **Member:** Accept care. Only now is care confirmed. Both perspectives show a booking confirmation containing the caregiver, time and broad location. Switch Provider to Jordan to show closure for a non-selected caregiver.

The System view is explanatory. No action in it is required to start matching or outreach.

## Exceptions

The Scenario selector loads deterministic demonstrations:

- **Provider says no:** Jordan replies NO and receives a request-specific acknowledgment. Avery remains available. The specialist sees the decline separately from interested candidates; System reports both responses.
- **No replies:** Advance the illustrative response window, automatically reach out to the next suitable group, and alert the specialist. **Take over manually** offers a fresh search or closure as unfilled. Silence remains unknown.
- **Provider withdraws:** Release the selection and surface the change to the specialist. Another interested caregiver can be selected or the specialist can take over.
- **Late reply:** Care is already confirmed. A late reply receives current closure without reopening the opportunity.

Providers can type a question in the message field; **Send reply** in the Specialist view returns the answer. Suggested YES/NO replies, typed replies, CONFIRM, and withdrawal all work. A cancellation after confirmed care revokes confirmation and automatically starts a fresh search, excluding the caregiver who withdrew. Prior closed replies do not become current availability again.

## Assumptions and design

The user’s revision specifies automatic matching/outreach and a quiet application interface with a plain background. This intentionally supersedes the repository’s shared atmospheric background for this private prototype. The rest of the website retains its background contract. Inter and restrained geometric progress indicators remain; Wellthy’s public coral/periwinkle cues inform the interface.

One compact **About this demo** note holds simulation boundaries, sources, and the proposed confirmation order. Provider → member confirmation, two-person initial outreach, ten-minute response window, compensation, and benefit terms require validation. No held availability, trained ranking model, measured time savings, or verified internal Wellthy architecture is implied.

References: [Wellthy Backup Care](https://wellthy.com/backup-care), [Apple Messages](https://support.apple.com/en-ca/guide/iphone/iph82fb73ba3/ios), [The Holding Co.](https://www.theholding.co/work/wellthy), and the supplied working PRD. The provider thread follows familiar incoming/outgoing message bubbles and a text composer. The publicly visible Wellthy page includes a conversation-style product illustration; historical product screenshots were located in the design partner’s case study, but direct asset inspection was blocked by the browsing policy.

## Verification

Run `node --test scripts/test-wellthy.mjs` with Node 22.18+ and `npm run build`. Tests cover automatic outreach, confirmation ordering, duplicate/stale actions, unknown responses and automatic expansion, withdrawal/cancellation, clarification, late replies, manual fallback, match exclusions, invalid care windows, scenarios, and reset.

The demo clock advances by scripted increments and includes intake. It is not an observed product metric. A real pilot should measure time from request submission to confirmed care communicated, alongside specialist active minutes, provider comprehension, member confidence, fulfillment, cancellations, and messaging burden, including unfilled requests.
