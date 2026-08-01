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

### Requirement: Remove an appliance

The system SHALL allow removing an appliance and SHALL cascade-delete its filters, warranties, and service records on that device.

#### Scenario: Remove cleans related records
- **GIVEN** an appliance with at least one filter schedule
- **WHEN** the appliance is removed
- **THEN** the appliance SHALL no longer appear in the list
- **AND** its filter schedules SHALL be removed
