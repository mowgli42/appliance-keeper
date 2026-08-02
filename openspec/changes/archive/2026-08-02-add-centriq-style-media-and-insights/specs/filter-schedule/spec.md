## ADDED Requirements

### Requirement: Filter purchase link

The system SHALL support an optional purchase URL (or store search hint) on a filter schedule so families can reorder parts without hunting through emails.

#### Scenario: Purchase link on filter
- **GIVEN** a filter with a purchase URL
- **WHEN** the appliance detail view is shown
- **THEN** the filter row SHALL expose that link as a buy/reorder action
