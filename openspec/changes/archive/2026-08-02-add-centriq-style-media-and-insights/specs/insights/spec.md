## ADDED Requirements

### Requirement: Useful-life guidance

The system SHALL compute appliance age from `purchasedAt` (when known) and present a plain-language useful-life hint from a local lookup by appliance kind, without network access.

#### Scenario: Mid-life refrigerator
- **GIVEN** a refrigerator purchased about 4 years ago
- **WHEN** useful-life guidance is requested as of today
- **THEN** the hint SHALL include the approximate age in years
- **AND** the hint SHALL include a typical lifespan range for refrigerators
- **AND** the recommendation SHALL be one of `repair-friendly`, `evaluate`, or `replace-likely`

### Requirement: Manufacturer support contacts

The system SHALL match a normalized brand string to a local contact list and expose phone and/or support URL when known.

#### Scenario: Known brand match
- **GIVEN** an appliance brand of "Whirlpool"
- **WHEN** manufacturer contacts are looked up
- **THEN** a support entry for Whirlpool SHALL be returned
- **AND** it SHALL include a support URL or phone number

#### Scenario: Unknown brand fallback
- **GIVEN** an appliance brand of "AcmeFancyCo"
- **WHEN** manufacturer contacts are looked up
- **THEN** the result SHALL indicate no curated contact
- **AND** a search hint string SHALL include the brand name
