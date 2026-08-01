# Appliance Keeper

Local-first appliance, filter, warranty, and service tracker for the household. Built for non-technical family members: plain language, a calm “needs attention” home screen, and data that stays on the device.

**Stack:** Capacitor + SvelteKit (Svelte 5) · OpenSpec + Gherkin + Beads

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

Static output is in `build/` (SPA fallback `index.html` for client-added appliances).

## Capacitor (native shell)

After a web build:

```bash
npm run build
npx cap sync
npx cap open android   # or ios
```

App id: `com.mowgli42.appliancekeeper`. Web assets are loaded from `build/`.

## Spec-driven development

See **`openspec/WORKFLOW.md`**.

| Piece | Location |
|-------|----------|
| Living specs | `openspec/specs/` |
| Gherkin | `features/*.feature` |
| Unit tests | `src/lib/**/*.test.ts` |
| Tasks | `bd ready` |

```bash
npm test
npm run test:gherkin
```

## Phase 1 scope

- Appliance registry with rooms/types
- Filter schedules + “mark changed”
- Warranties and service history
- Attention list (due soon / overdue)
- `localStorage` persistence + demo seed reset

Non-goals yet: cloud sync, OCR, smart-home control.

## License

Private / unpublished until you choose otherwise. Repo is public on GitHub; treat household data as local-only.
