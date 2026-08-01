## OpenSpec + Gherkin + Beads workflow

**Full workflow:** `openspec/WORKFLOW.md`

This project uses [OpenSpec](https://github.com/Fission-AI/OpenSpec) with Gherkin verification and [Beads](https://github.com/steveyegge/beads) for task tracking.

**Before implementing features:**
- Read `openspec/WORKFLOW.md` and relevant `openspec/specs/<capability>/spec.md`
- Run `bd ready` and announce the issue you are taking
- Treat scenario blocks as the behavioral contract; mirror them in `features/*.feature`

**Workflow:** spec → Beads issues → implement → `npm test` + `npm run test:gherkin` → archive

## Learned Workspace Facts

- Appliance Keeper is SvelteKit (Svelte 5) + TypeScript + Tailwind v4 + `@sveltejs/adapter-static` with SPA fallback.
- Domain types: `src/lib/types/appliance.ts`; due-date/attention rules: `src/lib/appliance/attentionRules.ts`.
- Seed data: `src/lib/data/seed.ts`; persistence: `src/lib/store/household.svelte.ts` (`localStorage`).
- Primary routes: `/` (attention), `/appliances`, `/appliances/[id]`, `/add`.
- Capacitor wraps `build/` for native shells (`npm run build && npx cap sync`).
- Audience is non-tech family members — prefer plain language and large controls.

## Issue Tracking

```bash
bd ready
bd create "Title" --type task --priority 2
bd close <id>
```

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
