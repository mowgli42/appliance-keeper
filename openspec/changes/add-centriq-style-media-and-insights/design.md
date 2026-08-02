# Design notes — media & insights

## Storage

- Photos and PDFs live in the Capacitor app’s private filesystem (or web equivalent via Origin Private File System / downloadable blobs).
- Database stores only relative paths + metadata (mime, capture date, caption, kind: nameplate | receipt | manual | other).
- Export packages the JSON + a zip of media when the user requests a full backup.

## Useful life

Hard-coded conservative ranges by `kind` (refrigerator, hvac, washer, dryer, dishwasher, range, water_heater, etc.). No network required. Display as:

> This fridge is ~8 years old. Typical useful life is 12–15 years. Most owners repair until ~10–12 years if the compressor is healthy.

## Manufacturer contacts

Static JSON or TS module. Match on normalized brand string. Fallback: “Search for [brand] support”. Never call out to the network unless the user taps the link.

## PDF

Prefer a lightweight client library (or pure canvas / print stylesheet) so the feature works offline. Include:
- Header with household name / export date
- Per-appliance blocks (identity, warranty, filters due, last service, photo if present)
- Footer note that data is local-only

## Privacy

No telemetry. No automatic upload of photos or serial numbers. Recall checks (future) must be explicit opt-in and only send the model string the user selects.
