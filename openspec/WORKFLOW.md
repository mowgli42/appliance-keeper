# Agent Workflow: OpenSpec + Gherkin + Beads

Follow this order unless the user explicitly requests a different approach.

## 1. Discovery & Specification (OpenSpec)

- Create or update `openspec/specs/<capability>/spec.md` with:
  - Clear **Purpose**
  - Formal requirements using **SHALL** language
  - **GIVEN / WHEN / THEN / AND** scenarios
- Mirror scenarios in `features/*.feature`
- Validate changes: `npx @fission-ai/openspec validate [change-id] --strict`

## 2. Task Breakdown & Tracking (Beads)

- Create Beads issues from requirements/scenarios
- Before implementation: `bd ready`
- Update status with labels (`status:specified`, `status:implementing`, `status:gherkin-verified`)

## 3. Implementation

- One Beads issue at a time
- Put domain rules in testable modules under `src/lib/appliance/`
- Wire UI to domain modules; avoid duplicating date math in components

## 4. Gherkin Verification

- `features/<capability>.feature` + `features/step_definitions/*.ts`
- Run: `npm run test:gherkin` and `npm test`

## 5. Validation & Archiving

- `openspec validate` before archive
- Close related Beads when Gherkin + unit tests pass

## Living specs

| Capability | Spec |
|------------|------|
| Index | `openspec/specs/README.md` |
| Appliance registry | `openspec/specs/appliance/spec.md` |
| Filter schedules | `openspec/specs/filter-schedule/spec.md` |
| Attention list | `openspec/specs/attention/spec.md` |
| Warranty | `openspec/specs/warranty/spec.md` |
| Service records | `openspec/specs/service-record/spec.md` |
