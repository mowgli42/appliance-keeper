# Proposal: Centriq-style media, manuals, useful-life insights, and manufacturer contacts

## Why

The classic Centriq / HomeServe app (reviewed by This Old House) set the bar for home-appliance organization: camera scan of the nameplate, attached manuals and receipts, replacement-part / filter links, recall awareness, room organization, and simple “repair vs replace” guidance via useful-life estimates.

Modern local-first apps (My Warranty Vault, ApplianceIQ, kept, etc.) still emphasize the same core: photos, documents, color-coded status, manufacturer contacts, and PDF export for claims.

Appliance Keeper already has the data model spine (appliances, filters, warranties, service, attention). This change adds the high-value media and insight layer that makes the app feel complete for non-technical family members while staying fully local-first and private.

## Scope (in)

- Attach one or more photos to an appliance (nameplate, receipt, overall shot) via Capacitor Camera / Filesystem.
- Optional short video or additional document attachment (PDF manual, warranty card) stored on-device.
- Simple “useful life” / age guidance: expected lifespan by appliance kind + current age → repair-vs-replace hint.
- Built-in or lightly curated manufacturer support contacts (phone / web) for common brands, shown on the appliance detail page.
- PDF export of a single appliance dossier or full household summary (for insurance, sale, or estate).
- Filter purchase link / preferred store already partially present; reinforce as first-class.

## Scope (out for this change)

- Live OCR / automatic serial extraction from photos (future, on-device if feasible).
- Automatic download of manufacturer manuals from the internet (privacy + reliability risk).
- Cloud sync or third-party claim filing.
- Full CPSC recall API integration (can be a later optional opt-in).

## Success

- A non-technical user can photograph the nameplate, attach the receipt, see a simple age-based tip, and export a clean PDF without leaving the device.
- OpenSpec and Gherkin updated for the new capabilities.
- Beads tasks created for implementation.

## References

- Centriq / HomeServe (This Old House coverage)
- My Warranty Vault, ApplianceIQ, kept, HomiHub feature sets (2026)
