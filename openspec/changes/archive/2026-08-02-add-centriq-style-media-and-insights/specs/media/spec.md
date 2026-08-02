## ADDED Requirements

### Requirement: Attach local media to an appliance

The system SHALL allow attaching one or more local media items (photo or document) to an appliance, each with a kind of `nameplate`, `receipt`, `manual`, or `other`.

#### Scenario: Add nameplate photo
- **GIVEN** an appliance without media
- **WHEN** a user attaches a photo with kind `nameplate`
- **THEN** the appliance SHALL have that media item in its gallery
- **AND** the media SHALL remain available after a local reload (persisted on-device)

### Requirement: Remove media

The system SHALL allow removing a media item from an appliance without deleting the appliance.

#### Scenario: Remove receipt
- **GIVEN** an appliance with a receipt attachment
- **WHEN** the user removes that attachment
- **THEN** the receipt SHALL no longer appear in the gallery
