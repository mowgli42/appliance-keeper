Feature: Appliance registry
  Families keep a plain-language list of household appliances.

  Scenario: Appliance appears in seed household
    Given the demo household seed
    Then an appliance named "Kitchen fridge" should exist
    And it should be in room "kitchen"
