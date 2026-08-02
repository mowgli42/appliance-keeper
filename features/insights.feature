Feature: Useful-life and manufacturer insights
  Families get plain-language age guidance and brand support contacts offline.

  Scenario: Mid-life refrigerator guidance
    Given a refrigerator purchased on "2022-04-12"
    When useful-life guidance is requested as of "2026-08-01"
    Then the age in years should be 4
    And the typical lifespan should be 12 to 15 years
    And the recommendation should be "repair-friendly"

  Scenario: Known brand match
    Given an appliance brand of "Whirlpool"
    When manufacturer contacts are looked up
    Then a support entry for "Whirlpool" should be returned

  Scenario: Unknown brand fallback
    Given an appliance brand of "AcmeFancyCo"
    When manufacturer contacts are looked up
    Then no curated contact should be returned
    And the search hint should include "AcmeFancyCo"
