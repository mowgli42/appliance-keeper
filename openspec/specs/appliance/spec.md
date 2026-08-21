# Appliance registry

## Purpose

Households SHALL be able to keep a plain-language list of appliances with room and type so family members can find the right machine without serial numbers.

## Requirements

### Requirement: Register an appliance

The system SHALL store an appliance with a human name, kind, and room.

#### Scenario: Add named appliance
- **GIVEN** an empty or existing household
- **WHEN** a user adds an appliance named "Kitchen fridge" of kind refrigerator in the kitchen
- **THEN** the appliance SHALL appear in the appliance list
- **AND** its detail page SHALL be reachable by id

### Requirement: Capture filter when adding an appliance

When a family registers an appliance that has a filter, the system SHALL allow capturing the filter's plain-language name and change frequency (`intervalDays`) in the same add flow, and SHALL create the filter schedule linked to the new appliance.

#### Scenario: Add fridge with water filter every 6 months
- **GIVEN** an empty or existing household
- **WHEN** a user adds a refrigerator named "Kitchen fridge" with a filter labeled "Water filter" and frequency 180 days, last changed today
- **THEN** the appliance SHALL appear in the appliance list
- **AND** a filter schedule for that appliance SHALL exist with label "Water filter" and intervalDays 180

#### Scenario: Appliance without a filter
- **GIVEN** an empty or existing household
- **WHEN** a user adds an appliance and opts out of filter tracking
- **THEN** the appliance SHALL be stored
- **AND** no filter schedule SHALL be created for that appliance


#### Scenario: Remove cleans related records
- **GIVEN** an appliance with at least one filter schedule
- **WHEN** the appliance is removed
- **THEN** the appliance SHALL no longer appear in the list
- **AND** its filter schedules SHALL be removed
