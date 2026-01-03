Feature: Update Order Payment Status
  As a payment system
  I want to update the order payment status
  So that the order can proceed to preparation

  Scenario: Successfully update order to paid status
    Given an order exists with ID 1
    When I update the order payment status to PAID with transaction "TXN-123"
    Then the order status should be updated to PAID
    And the order should be sent to product gateway for preparation

  Scenario: Fail to update payment for non-existent order
    Given no order exists with ID 999
    When I try to update the order payment status to PAID
    Then the update should fail
    And I should receive a "Order not found" error

  Scenario: Fail to update payment with invalid order ID
    Given I have an invalid order ID "abc"
    When I try to update the order payment status
    Then the update should fail
    And I should receive a validation error

  Scenario: Fail when product gateway is unavailable
    Given an order exists with ID 1
    And the product gateway is unavailable
    When I try to update the order payment status to PAID
    Then the update should fail
    And I should receive a gateway error
