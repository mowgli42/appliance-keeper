# Tasks — Centriq-style media & insights

1. **Media model** — Extend appliance (and optionally filter/service) records with local file references for photos and documents. Use Capacitor Filesystem + Camera plugins. Keep paths relative to the app’s private storage.
2. **UI: attach media** — On appliance detail, large “Add photo of nameplate / receipt” buttons. Thumbnail gallery with full-screen view. Support PDF attachment for manuals.
3. **Useful-life hints** — Simple lookup table by appliance kind (fridge ~12–15 yr, HVAC ~15–20 yr, washer ~10–12 yr, etc.). Show age + “typical lifespan” + soft recommendation on the detail page.
4. **Manufacturer contacts** — Static or lightly curated list (Samsung, LG, Whirlpool, GE, Carrier, Trane, Bosch, Maytag…). Show phone / support URL on detail when brand matches.
5. **PDF export** — Client-side generation of a single-appliance or household dossier (name, model, serial, warranty, filters, service history, attached photo thumbnails if feasible). Share via Capacitor Share / Filesystem.
6. **OpenSpec + Gherkin** — Add requirements and scenarios under `openspec/specs/` (or a new `media` / `insights` capability) and corresponding `.feature` files.
7. **Beads** — Convert the above into `bd create` issues with dependencies after this change is accepted.

Priority order: 1 → 2 → 5 → 3 → 4 → 6 → 7.
