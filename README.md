# Appliance Keeper

Local-first household tracker for appliances, filter changes, warranties, and service history. Built for non-technical family members: plain language, a calm **Needs attention** home screen, and data that stays on the device.

Today you can browse a demo household, see due and overdue filters/warranties/service, and mark a filter as changed. Nothing leaves the device.

## Screenshots

| Needs attention | Appliance detail |
|-----------------|------------------|
| ![Needs attention home](docs/images/attention-home.png) | ![Kitchen fridge detail](docs/images/appliance-detail.png) |

## Architecture

```mermaid
flowchart LR
  UI[SvelteKit UI<br/>static SPA] --> Store[Household store<br/>localStorage]
  Store --> Rules[Attention rules<br/>due · overdue]
  UI --> Caps[Capacitor shell<br/>Android]
  Specs[OpenSpec + Gherkin + Beads] -.-> UI
```

- **Web:** SvelteKit + adapter-static (SPA fallback)
- **Native:** Capacitor wraps `build/` (`com.mowgli42.appliancekeeper`)
- **Persistence:** on-device only (`localStorage`)
- **Specs:** living OpenSpec under `openspec/specs/`, verified by `features/*.feature`

## Sequence: filter care

```mermaid
sequenceDiagram
  actor Family
  participant Home as Needs attention
  participant Detail as Appliance detail
  participant Store as Household store

  Family->>Home: Open app
  Home->>Store: Load appliances / filters
  Store-->>Home: Due and overdue items
  Family->>Detail: Open appliance from list
  Family->>Detail: Mark filter changed
  Detail->>Store: Update lastChangedAt
  Store-->>Detail: New due date
  Family->>Home: Return home
  Home->>Store: Rebuild attention list
  Store-->>Home: Item cleared or rescheduled
```

## Remaining / planned

- Warranty / service add forms (Beads)
- Native Capacitor Filesystem storage for large media (Beads)
- Optional on-device OCR for nameplates (future)
- Cloud sync, recall APIs — explicitly out of scope for now

See `openspec/project.md` for living specs, including archived Centriq-style media / useful-life / dossier work that is specified but not all shipped in the Phase 1 UI.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build & Capacitor

```bash
npm run build
npm run preview
npm run cap:sync
npx cap open android
```

Static output is in `build/` (SPA fallback `index.html` for client-added appliances). App id: `com.mowgli42.appliancekeeper`.

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
