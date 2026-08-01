# Filter schedule

## Purpose

Families SHALL track recurring filter (or similar) care with a due date derived from last-changed date and interval.

## Requirements

### Requirement: Compute next due date

The system SHALL compute `nextDueAt = lastChangedAt + intervalDays` in calendar days.

#### Scenario: 180-day water filter
- **GIVEN** a filter last changed on 2026-01-01 with interval 180 days
- **WHEN** the next due date is calculated
- **THEN** the due date SHALL be 2026-06-30

### Requirement: Mark filter changed

The system SHALL update `lastChangedAt` when a user marks a filter as changed, resetting the due date.

#### Scenario: Mark changed today
- **GIVEN** a filter due in the past
- **WHEN** the user marks it changed on 2026-08-01
- **THEN** `lastChangedAt` SHALL be 2026-08-01
- **AND** the next due date SHALL be intervalDays after that date
