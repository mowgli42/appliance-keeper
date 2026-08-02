# dossier-export Specification

## Purpose
TBD - created by archiving change add-centriq-style-media-and-insights. Update Purpose after archive.
## Requirements
### Requirement: Export appliance dossier

The system SHALL build a printable, offline dossier for a single appliance including identity, warranties, filters, service history, and useful-life hint when available.

#### Scenario: Fridge dossier includes identity
- **GIVEN** the demo Kitchen fridge with warranties and filters
- **WHEN** a dossier HTML document is generated
- **THEN** the document SHALL include the appliance name
- **AND** the document SHALL include the model or serial when present
- **AND** the document SHALL note that data is local-only

### Requirement: Export household summary

The system SHALL build a printable household summary listing all appliances with key care status.

#### Scenario: Household summary lists appliances
- **GIVEN** the demo household seed
- **WHEN** a household summary dossier is generated
- **THEN** each seed appliance name SHALL appear in the document

