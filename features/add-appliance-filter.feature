Feature: Add appliance with filter frequency
  Families identify filter care and change frequency when adding an appliance.

  Scenario: Suggested fridge water filter every 6 months
    Given appliance kind "refrigerator"
    When a filter suggestion is requested as of "2026-08-21"
    Then the suggested filter label should be "Water filter"
    And the suggested interval days should be 180

  Scenario: Six-month frequency means 180 days
    Given the frequency presets
    Then the preset "Every 6 months" should equal 180 days
