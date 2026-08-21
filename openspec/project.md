# Appliance Keeper — Project Context

## Purpose

Appliance Keeper is a **local-first** household app for tracking appliances, filter changes, warranties, and service history. It is designed for **non-technical family members**: plain language, large tap targets, and a “what needs attention” home screen.

## Tech Stack

- **SvelteKit 2** + **Svelte 5** + **TypeScript**
- **Tailwind CSS v4**
- **Capacitor** — native shell (iOS/Android) over the static web build
- **Vitest** — unit tests for domain rules
- **Cucumber** — Gherkin verification (`features/`, `npm run test:gherkin`)
- **OpenSpec** — living specs in `openspec/specs/`
- **Beads** — task tracking (`.beads/`)

## Domain map

| Concern | Capability |
|---------|------------|
| Asset registry | `appliance` |
| Recurring care | `filter-schedule` |
| Coverage | `warranty` |
| Work history | `service-record` |
| Family home screen | `attention` |

## Conventions

- Domain types: `src/lib/types/appliance.ts`
- Attention / due-date rules: `src/lib/appliance/attentionRules.ts`
- Persistence: `localStorage` via `src/lib/store/household.svelte.ts` (Phase 1)
- Spec → Beads → implement → Gherkin (see `openspec/WORKFLOW.md`)

## Non-goals (Phase 1)

- OCR of receipts or manuals
- Smart-home device control
- Realtime CRDT / multi-writer merge
- Recall APIs

## Planned enhancement (not built)

**Optional account sync** — sign in, then pull/push the existing household JSON so iPhone and Android can share one household. Local-first remains the default when signed out.

See [`openspec/changes/add-optional-account-json-sync/`](changes/add-optional-account-json-sync/proposal.md) (proposal + design).
