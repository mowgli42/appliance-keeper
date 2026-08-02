# Proposal: Centriq-style media, manuals, useful-life insights, and manufacturer contacts

## Why

The classic Centriq / HomeServe app (reviewed by This Old House) set the bar for home-appliance organization: camera scan of the nameplate, attached manuals and receipts, replacement-part / filter links, recall awareness, room organization, and simple “repair vs replace” guidance via useful-life estimates.

Modern local-first apps (My Warranty Vault, ApplianceIQ, kept, etc.) still emphasize the same core: photos, documents, color-coded status, manufacturer contacts, and PDF export for claims.

Appliance Keeper already has the data model spine (appliances, filters, warranties, service, attention). This change adds the high-value media and insight layer that makes the app feel complete for non-technical family members while staying fully local-first and private.

## What Changes

- Attach one or more photos/documents to an appliance (nameplate, receipt, manual) stored on-device.
- Simple “useful life” / age guidance from local lookup tables (repair vs replace hint).
- Curated manufacturer support contacts (phone / web) matched by brand.
- Printable PDF-ready dossier export for one appliance or the whole household.
- Optional filter purchase URL as a first-class reorder action.

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
