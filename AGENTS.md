# appliance-keeper

Local-first household tracker for appliances, filters, warranties, and service history. Built for non-tech family members (plain language, calm Needs-attention home).
Stack: SvelteKit 5 + TypeScript + Tailwind v4 + adapter-static (SPA) + Capacitor (Android/iOS) + localStorage.
Posture: ponytail (repo >30 days). Shared health pack in `.cursor/skills/` and `.cursor/rules/` — use for [Health] work.

## Commands

- Dev: `npm run dev` → http://localhost:5173
- Test unit: `npm test` (or `npm run test:unit -- --run path/to/file.test.ts`)
- Test Gherkin: `npm run test:gherkin`
- Check: `npm run check`
- Build + Capacitor: `npm run build && npm run cap:sync`
- Screenshots: `npm run screenshots`

## Hard prohibitions

- Do not invent cloud sync, accounts, or off-device storage unless an OpenSpec change explicitly lands it. Keep data on-device (`localStorage` / future Capacitor Filesystem).
- Do not use TodoWrite / markdown TODOs. Use `bd` for all task tracking.
- Do not rewrite OpenSpec / Gherkin to match a hoped-for future. Update them only when code already changed.
- Do not add new npm dependencies for trivial jobs; climb the Ponytail ladder first.

## Verify by change type

| Change | Check |
| --- | --- |
| UI / Svelte routes | `npm run dev` + exercise `/`, `/appliances`, `/appliances/[id]`, `/add` |
| Attention / due rules | `npm test` (attentionRules) + `npm run test:gherkin` |
| Spec | matching `features/*.feature` + `openspec/specs/<cap>/spec.md` still true |
| Capacitor / build | `npm run build && npm run cap:sync` |

## Source of truth

- Behavior: `openspec/specs/` + `features/*.feature`
- Remaining work: `bd ready` / Beads
- Walkthrough: `docs/WALKTHROUGH.md` + `docs/images/`
- Workflow: `openspec/WORKFLOW.md`

## House vocabulary

- **Needs attention** — the home screen listing due/overdue filters, warranties, service. Prefer this phrase over “dashboard” or “alerts”.
- **Household store** — the on-device Svelte store (`src/lib/store/household.svelte.ts`). Not a server DB.

## Good / bad (from this repo)

Bad: inventing a new “sync” route or Firebase without an archived OpenSpec change.
Good: extend `attentionRules.ts` + seed + Gherkin for a new due-date rule.

## Borrowed patterns

- Hard prohibitions from ossrules.md pattern `hard-prohibition` (e.g. opencode, better-auth style firm “do not”).
- Verification by change type from `verification-matrix`.
- Pointing at source of truth from `single-source`.
- House vocabulary from `house-vocabulary`.

## Beads + session close

Use `bd ready` / `bd show` / `bd close`. Full Beads integration rules remain in the retained block below; session is not done until `git push` succeeds.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:7510c1e2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
