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

### Requirement: Change frequency

Each filter schedule SHALL store `intervalDays` as the change frequency used to compute the next due date.

#### Scenario: Frequency presets map to days
- **GIVEN** a family chooses "Every 6 months" when setting up a filter
- **WHEN** the filter schedule is saved
- **THEN** `intervalDays` SHALL be 180


#### Scenario: Mark changed today
- **GIVEN** a filter due in the past
- **WHEN** the user marks it changed on 2026-08-01
- **THEN** `lastChangedAt` SHALL be 2026-08-01
- **AND** the next due date SHALL be intervalDays after that date
