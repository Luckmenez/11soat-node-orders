Feature: Create Order
  As a customer
  I want to create an order with items
  So that I can purchase products

  Scenario: Successfully create order with valid items
    Given I am authenticated with a valid token
    And I have a valid order with 2 items
    When I create the order
    Then the order should be created successfully
    And the order should have an ID
    And a payment should be generated with QR code

  Scenario: Successfully create order with customer customizations
    Given I am authenticated with a valid token
    And I have an order with customized items
    When I create the order
    Then the order should be created successfully
    And the customizations should be included

  Scenario: Fail to create order with empty items
    Given I am authenticated with a valid token
    And I have an order with no items
    When I try to create the order
    Then the order creation should fail
    And I should receive an error message "Order must contain at least one item"

  Scenario: Fail to create order with invalid item quantity
    Given I am authenticated with a valid token
    And I have an order with invalid item quantity
    When I try to create the order
    Then the order creation should fail
    And I should receive an error about invalid quantity

  Scenario: Fail to create order with invalid authentication
    Given I am not authenticated
    And I have a valid order with items
    When I try to create the order
    Then the order creation should fail
    And I should receive an authentication error
