# Attention list

## Purpose

The home screen SHALL show only items that need family action soon — overdue or upcoming filters, expiring warranties, and due service — sorted with the most urgent first.

## Requirements

### Requirement: Surface due filters

The system SHALL include filter schedules within 14 days of due (including overdue) on the attention list.

#### Scenario: Overdue filter appears first
- **GIVEN** a filter overdue by 10 days and another due in 5 days
- **WHEN** the attention list is built
- **THEN** the overdue item SHALL appear before the soon item

### Requirement: Surface expiring warranties

The system SHALL include warranties ending within 60 days (or already ended) on the attention list.

### Requirement: Surface upcoming service

The system SHALL include service records with `nextDueAt` within 30 days (or overdue) on the attention list.

### Requirement: Quiet when clear

When nothing is due in the windows above, the attention list SHALL be empty so the UI can show an all-clear state.
