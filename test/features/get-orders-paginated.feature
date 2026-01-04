Feature: Get Paginated Orders
  As a system administrator
  I want to retrieve orders with pagination
  So that I can manage orders efficiently

  Scenario: Successfully retrieve first page of orders
    Given there are 15 orders in the system
    When I request page 1 with limit 10
    Then I should receive 10 orders
    And the total count should be 15
    And the current page should be 1

  Scenario: Successfully retrieve second page of orders
    Given there are 15 orders in the system
    When I request page 2 with limit 10
    Then I should receive 5 orders
    And the total count should be 15
    And the current page should be 2

  Scenario: Retrieve empty page when no orders exist
    Given there are no orders in the system
    When I request page 1 with limit 10
    Then I should receive 0 orders
    And the total count should be 0

  Scenario: Retrieve page beyond available data
    Given there are 5 orders in the system
    When I request page 3 with limit 10
    Then I should receive 0 orders
    And the total count should be 5
    And the current page should be 3
