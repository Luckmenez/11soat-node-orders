import { loadFeature, defineFeature } from 'jest-cucumber';
import { UpdateOrderPaymentUseCase } from '../../src/application/use-cases/update-order-payment.use-case';
import { OrderStatus } from '../../src/application/value-objects/order-status.enum';
import {
  createMockOrderRepository,
  createMockOrderRepositoryWithNotFound,
} from '../utils/mocks/order-repository.mock';
import {
  createMockProductGateway,
  createMockProductGatewayWithError,
} from '../utils/mocks/product-gateway.mock';

const feature = loadFeature('./test/features/update-order-payment.feature');

defineFeature(feature, (test) => {
  let useCase: UpdateOrderPaymentUseCase;
  let mockOrderRepository: any;
  let mockProductGateway: any;
  let orderId: number | string;
  let transactionId: string;
  let error: any;

  beforeEach(() => {
    mockOrderRepository = createMockOrderRepository();
    mockProductGateway = createMockProductGateway();

    useCase = new UpdateOrderPaymentUseCase(
      mockOrderRepository,
      mockProductGateway,
    );

    error = null;
  });

  test('Successfully update order to paid status', ({ given, when, then, and }) => {
    given('an order exists with ID 1', () => {
      orderId = 1;
    });

    when('I update the order payment status to PAID with transaction "TXN-123"', async () => {
      transactionId = 'TXN-123';
      await useCase.execute(
        { orderId: orderId as number },
        { status: OrderStatus.PAID, transactionId },
      );
    });

    then('the order status should be updated to PAID', () => {
      expect(mockOrderRepository.updateStatus).toHaveBeenCalledWith(
        1,
        OrderStatus.PAID,
        'TXN-123',
      );
    });

    and('the order should be sent to product gateway for preparation', () => {
      expect(mockProductGateway.sendToPreparation).toHaveBeenCalled();
    });
  });

  test('Fail to update payment for non-existent order', ({ given, when, then, and }) => {
    given('no order exists with ID 999', () => {
      orderId = 999;
      mockOrderRepository = createMockOrderRepositoryWithNotFound();
      useCase = new UpdateOrderPaymentUseCase(
        mockOrderRepository,
        mockProductGateway,
      );
    });

    when('I try to update the order payment status to PAID', async () => {
      try {
        await useCase.execute(
          { orderId: orderId as number },
          { status: OrderStatus.PAID, transactionId: 'TXN-999' },
        );
      } catch (err) {
        error = err;
      }
    });

    then('the update should fail', () => {
      expect(error).toBeDefined();
    });

    and('I should receive a "Order not found" error', () => {
      expect(error.message).toContain('Order not found');
    });
  });

  test('Fail to update payment with invalid order ID', ({ given, when, then, and }) => {
    given('I have an invalid order ID "abc"', () => {
      orderId = 'abc';
    });

    when('I try to update the order payment status', async () => {
      try {
        await useCase.execute(
          { orderId: orderId as any },
          { status: OrderStatus.PAID, transactionId: 'TXN-ABC' },
        );
      } catch (err) {
        error = err;
      }
    });

    then('the update should fail', () => {
      expect(error).toBeDefined();
    });

    and('I should receive a validation error', () => {
      expect(error.message).toMatch(/invalid|must be|orderId/i);
    });
  });

  test('Fail when product gateway is unavailable', ({ given, and, when, then }) => {
    given('an order exists with ID 1', () => {
      orderId = 1;
    });

    and('the product gateway is unavailable', () => {
      mockProductGateway = createMockProductGatewayWithError();
      useCase = new UpdateOrderPaymentUseCase(
        mockOrderRepository,
        mockProductGateway,
      );
    });

    when('I try to update the order payment status to PAID', async () => {
      try {
        await useCase.execute(
          { orderId: orderId as number },
          { status: OrderStatus.PAID, transactionId: 'TXN-123' },
        );
      } catch (err) {
        error = err;
      }
    });

    then('the update should fail', () => {
      expect(error).toBeDefined();
    });

    and('I should receive a gateway error', () => {
      expect(error.message).toContain('Product gateway unavailable');
    });
  });
});
