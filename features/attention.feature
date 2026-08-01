Feature: Attention list
  The home screen surfaces overdue and upcoming care items.

  Scenario: Overdue filter appears before soon filter
    Given appliance "Kitchen fridge" with id "app-fridge"
    And a filter "Water filter" on "app-fridge" last changed "2026-01-01" interval 30 days
    And a filter "Air filter" on "app-fridge" last changed "2026-07-25" interval 14 days
    When the attention list is built for "2026-08-01"
    Then the first attention title should be "Water filter"
    And attention should include "Air filter"
