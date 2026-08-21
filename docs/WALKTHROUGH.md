# Appliance Keeper — workflow walkthrough

Plain-language tour of what works **today** on the device, plus the **planned** sign-in sync flow for iPhone + Android.

Data stays on the phone unless you later opt into account sync.

---

## 1. Open the app — Needs attention

The home screen (**Today**) answers one question: *what should someone in the house do soon?*

![Needs attention home](images/01-attention-home.png)

You see overdue filters, upcoming service, and warranties that end soon. Tap a row to open that appliance.

Nothing due? You’ll get an all-clear and a link to browse appliances.

---

## 2. Browse the household

**Appliances** lists every machine by the name people actually say (“Kitchen fridge”, “Upstairs HVAC”).

![Appliances list](images/02-appliances-list.png)

Tap one for filters, warranties, and service history.

---

## 3. Appliance detail

Identity (room, type, brand/model) sits at the top. Below that: filters with due dates, warranties, and past service.

![Kitchen fridge detail](images/03-appliance-detail.png)

---

## 4. Mark a filter changed

When you replace a filter, tap **Mark changed**. The app records today as the last-changed date and recalculates the next due date from the interval (for example every 180 days).

![After marking the fridge water filter changed](images/04-filter-marked-changed.png)

---

## 5. Home updates automatically

Back on **Today**, that filter drops off (or moves later) because attention is rebuilt from the same on-device data.

![Needs attention after filter change](images/05-attention-after-filter.png)

---

## 6. Add an appliance

**Add** uses everyday language — name, type, room, optional brand/model. Save opens the new appliance’s detail page.

![Add appliance form](images/06-add-appliance.png)

---

## End-to-end (today)

```mermaid
sequenceDiagram
  actor Family
  participant Today as Today / Needs attention
  participant List as Appliances
  participant Detail as Appliance detail
  participant Store as On-device store

  Family->>Today: Open app
  Today->>Store: Load household
  Store-->>Today: Due and overdue items
  Family->>Detail: Tap a filter row
  Family->>Detail: Mark filter changed
  Detail->>Store: Update lastChangedAt
  Family->>Today: Return home
  Today->>Store: Rebuild attention
  Store-->>Today: Item cleared or rescheduled
```

**Also useful**

- **Reset demo household** — restores the sample data on this device only.
- Demo data never leaves the device in Phase 1.

---

## Planned later: sign in → pull/push JSON

Not built yet. Design lives in [`openspec/changes/add-optional-account-json-sync/`](../openspec/changes/add-optional-account-json-sync/proposal.md).

Goal: same household on iPhone and Android without turning the app into a complex realtime editor.

```mermaid
sequenceDiagram
  actor Family
  participant App as Phone app
  participant Local as On-device store
  participant Cloud as Optional account store

  Family->>App: Sign in (optional)
  App->>Cloud: Auth
  App->>Cloud: Pull household JSON
  Cloud-->>App: Remote document (or empty)
  App->>Local: Load / confirm pull
  Family->>App: Edit as usual (still local-first)
  App->>Local: Save immediately
  Family->>App: Sync now
  App->>Cloud: Push full household JSON
  alt Someone else pushed first
    Cloud-->>App: Conflict
    App->>Family: Keep this phone / Keep cloud / Cancel
  else OK
    Cloud-->>App: New revision saved
  end
```

**Still true after sync ships**

- Signed out = today’s behavior (local only).
- Edits never wait on the network.
- Whole-document pull/push — not field-by-field CRDT merge.

---

## Regenerating screenshots

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
# other terminal:
node scripts/screenshots.mjs
```

Images land in `docs/images/` (`01`–`06`).
