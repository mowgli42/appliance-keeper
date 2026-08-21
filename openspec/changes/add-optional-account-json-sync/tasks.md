# Tasks — optional account JSON sync

*Documentation-only for now. Convert to Beads when implementation starts.*

1. **Choose backend** — Supabase (hosted) vs PocketBase (self-hosted); record decision in design.md.
2. **Settings shell** — Sign in / Sign out / Sync now / last-synced label.
3. **Remote document API** — GET/PUT household JSON with revision / If-Match.
4. **Conflict picker** — Keep phone / Keep cloud / Cancel.
5. **Media policy** — Strip or cap `dataUrl` on push in v1; file follow-up for blob storage.
6. **OpenSpec + Gherkin** — Add `account-sync` capability scenarios before coding merge rules.
7. **Beads** — `bd create` implementation issues with deps once this change is accepted for build.
