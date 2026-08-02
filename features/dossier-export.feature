Feature: Printable dossier export
  Households can print or save a local-only PDF-ready dossier.

  Scenario: Fridge dossier includes identity
    Given the demo household seed
    When an appliance dossier is generated for "app-fridge" as of "2026-08-01"
    Then the dossier should include "Kitchen fridge"
    And the dossier should note that data is local-only

  Scenario: Household summary lists appliances
    Given the demo household seed
    When a household dossier is generated as of "2026-08-01"
    Then the dossier should include "Kitchen fridge"
    And the dossier should include "Upstairs HVAC"
    And the dossier should include "Washer"
    And the dossier should include "Dishwasher"
