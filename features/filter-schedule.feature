Feature: Filter schedule due dates
  Households track recurring filter care with last-changed + interval.

  Scenario: 180-day water filter due date
    Given a filter last changed on "2026-01-01" with interval 180 days
    When the next due date is calculated
    Then the due date should be "2026-06-30"

  Scenario: Mark filter changed resets the schedule
    Given a filter last changed on "2026-01-01" with interval 90 days
    When the filter is marked changed on "2026-08-01"
    Then the last changed date should be "2026-08-01"
    And the next due date should be 90 days after "2026-08-01"
