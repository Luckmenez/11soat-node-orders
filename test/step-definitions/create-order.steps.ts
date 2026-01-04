import { loadFeature, defineFeature } from 'jest-cucumber';
import { CreateOrderUseCase } from '../../src/application/use-cases/create-order.use-case';
import { OrderFactory } from '../utils/factories/order.factory';
import {
  createMockAuthGateway,
  createMockAuthGatewayWithError,
} from '../utils/mocks/auth-gateway.mock';
import { createMockOrderRepository } from '../utils/mocks/order-repository.mock';
import { createMockPaymentGateway } from '../utils/mocks/payment-gateway.mock';

const feature = loadFeature('./test/features/create-order.feature');

defineFeature(feature, (test) => {
  let useCase: CreateOrderUseCase;
  let mockAuthGateway: any;
  let mockOrderRepository: any;
  let mockPaymentGateway: any;
  let orderData: any;
  let token: string;
  let result: any;
  let error: any;

  beforeEach(() => {
    mockAuthGateway = createMockAuthGateway();
    mockOrderRepository = createMockOrderRepository();
    mockPaymentGateway = createMockPaymentGateway();

    useCase = new CreateOrderUseCase(
      mockAuthGateway,
      mockOrderRepository,
      mockPaymentGateway,
    );

    error = null;
    result = null;
  });

  test('Successfully create order with valid items', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am authenticated with a valid token', () => {
      token = 'valid-token';
    });

    and('I have a valid order with 2 items', () => {
      orderData = OrderFactory.createValidOrderData();
      orderData.items = OrderFactory.createMultipleOrderItems(2);
    });

    when('I create the order', async () => {
      result = await useCase.execute(orderData, token);
    });

    then('the order should be created successfully', () => {
      expect(result).toBeDefined();
      expect(mockOrderRepository.save).toHaveBeenCalled();
    });

    and('the order should have an ID', () => {
      expect(result.orderId).toBeDefined();
      expect(typeof result.orderId).toBe('number');
    });

    and('a payment should be generated with QR code', () => {
      expect(result.qrCodeBase64).toBeDefined();
      expect(result.urlPayment).toBeDefined();
      expect(mockPaymentGateway.createPayment).toHaveBeenCalled();
    });
  });

  test('Successfully create order with customer customizations', ({
    given,
    and,
    when,
    then,
  }) => {
    given('I am authenticated with a valid token', () => {
      token = 'valid-token';
    });

    and('I have an order with customized items', () => {
      orderData = OrderFactory.createOrderWithCustomizations();
    });

    when('I create the order', async () => {
      result = await useCase.execute(orderData, token);
    });

    then('the order should be created successfully', () => {
      expect(result).toBeDefined();
      expect(mockOrderRepository.save).toHaveBeenCalled();
    });

    and('the customizations should be included', () => {
      expect(result.orderId).toBeDefined();
      const savedOrder = mockOrderRepository.save.mock.calls[0][0];
      expect(savedOrder.items[0].customerItems).toBeDefined();
      expect(savedOrder.items[0].customerItems.length).toBeGreaterThan(0);
    });
  });

  test('Fail to create order with empty items', ({
    given,
    and,
    when,
    then,
  }) => {
    given('I am authenticated with a valid token', () => {
      token = 'valid-token';
    });

    and('I have an order with no items', () => {
      orderData = OrderFactory.createOrderWithInvalidData('emptyItems');
    });

    when('I try to create the order', async () => {
      try {
        await useCase.execute(orderData, token);
      } catch (err) {
        error = err;
      }
    });

    then('the order creation should fail', () => {
      expect(error).toBeDefined();
    });

    and(
      'I should receive an error message "Order must contain at least one item"',
      () => {
        expect(error.message).toContain('Order must contain at least one item');
      },
    );
  });

  test('Fail to create order with invalid item quantity', ({
    given,
    and,
    when,
    then,
  }) => {
    given('I am authenticated with a valid token', () => {
      token = 'valid-token';
    });

    and('I have an order with invalid item quantity', () => {
      orderData = OrderFactory.createOrderWithInvalidData(
        'invalidItemQuantity',
      );
    });

    when('I try to create the order', async () => {
      try {
        await useCase.execute(orderData, token);
      } catch (err) {
        error = err;
      }
    });

    then('the order creation should fail', () => {
      expect(error).toBeDefined();
    });

    and('I should receive an error about invalid quantity', () => {
      expect(error.message).toContain('quantity');
    });
  });

  test('Fail to create order with invalid authentication', ({
    given,
    and,
    when,
    then,
  }) => {
    given('I am not authenticated', () => {
      token = 'invalid-token';
      mockAuthGateway = createMockAuthGatewayWithError();
      useCase = new CreateOrderUseCase(
        mockAuthGateway,
        mockOrderRepository,
        mockPaymentGateway,
      );
    });

    and('I have a valid order with items', () => {
      orderData = OrderFactory.createValidOrderData();
    });

    when('I try to create the order', async () => {
      try {
        await useCase.execute(orderData, token);
      } catch (err) {
        error = err;
      }
    });

    then('the order creation should fail', () => {
      expect(error).toBeDefined();
    });

    and('I should receive an authentication error', () => {
      expect(error.message).toMatch(/Authentication failed|Invalid token/i);
    });
  });
});
