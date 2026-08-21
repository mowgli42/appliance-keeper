# Proposal: Optional account sync (sign in → pull/push household JSON)

## Why

Phase 1 keeps all household data on one device (`localStorage`). That is private and simple, but a family with both an iPhone and an Android phone (or a phone + tablet) cannot share one household, and a reinstall can wipe the demo or real data.

We want the smallest cloud step that makes Capacitor apps usable across devices: **optional sign-in**, then **pull/push the household JSON** the app already uses. No CRDTs, no multi-writer OT, no always-on realtime — just a signed-in backup and sync of one household document.

## What Changes (when implemented)

- Optional account (email magic link or OAuth) via a managed backend (Supabase) **or** a self-hosted PocketBase.
- After sign-in: **pull** remote household JSON into the local store (with an explicit conflict choice if both sides changed).
- After local edits (or on a simple “Sync now” / app-foreground debounce): **push** the current household JSON to the user’s household record.
- Signed-out mode remains fully local-first (today’s behavior).
- Document privacy expectations: data is the family’s; sync is opt-in.

## Scope (out)

- Realtime collaborative editing / CRDT merge of every field
- Per-field conflict UI beyond “keep mine / keep cloud / cancel”
- Automatic media blob sync of large photos in v1 of this change (JSON + small attachments first; large media may stay device-local or follow in a follow-up)
- Multi-household orgs, sharing with neighbors, or public links
- CPSC recall APIs or other third-party data brokers

## Success

- A family can sign in on two phones and end up with the same appliances / filters / warranties / service list after sync.
- Offline use still works; sync retries when the network returns.
- OpenSpec living capability + Gherkin scenarios land with the implementation (this proposal only documents the approach).

## References

- **Walkthrough (today + planned sync):** [`docs/WALKTHROUGH.md`](../../../docs/WALKTHROUGH.md)
- Current store: `src/lib/store/household.svelte.ts` (`HouseholdState` JSON)
- Product direction: Capacitor iOS/Android shells already planned; sync unlocks multi-device
- Backend candidates: Supabase (hosted Postgres) or PocketBase (self-hosted SQLite)
