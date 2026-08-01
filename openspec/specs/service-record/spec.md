# Service record

## Purpose

Families SHALL keep a simple history of service visits and optional next-due reminders.

## Requirements

### Requirement: Store service history

The system SHALL store service records with title, performed date, and optional next due date, technician, cost, and notes.

#### Scenario: Annual tune-up reminder
- **GIVEN** a service record with `nextDueAt` within 30 days
- **WHEN** the attention list is built
- **THEN** that service SHALL appear as a service-due attention item
