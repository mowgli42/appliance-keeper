# Warranty

## Purpose

Families SHALL record warranty coverage windows and document location notes without needing cloud storage.

## Requirements

### Requirement: Store warranty window

The system SHALL store a warranty with label, start date, end date, and optional provider / document note linked to an appliance.

#### Scenario: Manufacturer warranty on file
- **GIVEN** an appliance
- **WHEN** a warranty ending on a known date is stored
- **THEN** attention logic SHALL use the end date for expiry surfacing
