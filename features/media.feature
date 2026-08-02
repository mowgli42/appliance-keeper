Feature: Local media attachments
  Families attach nameplate photos and receipts that stay on the device.

  Scenario: Add nameplate photo to gallery
    Given an empty media gallery
    When a nameplate photo is attached to "app-fridge"
    Then the gallery for "app-fridge" should have 1 items
    And the first item kind should be "nameplate"

  Scenario: Remove receipt from gallery
    Given a receipt attachment on "app-fridge"
    When that media item is removed
    Then the gallery for "app-fridge" should have 0 items
