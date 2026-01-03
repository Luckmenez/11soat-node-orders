import { OrdersController } from '../orders.controller';
import { OrderStatus } from '../../value-objects/order-status.enum';
import { OrderFactory } from '../../../../test/utils/factories/order.factory';

describe('OrdersController', () => {
  let controller: OrdersController;
  let mockCreateOrderUseCase: any;
  let mockGetOrdersPaginatedUseCase: any;
  let mockUpdateOrderPaymentUseCase: any;

  beforeEach(() => {
    mockCreateOrderUseCase = {
      execute: jest.fn().mockResolvedValue({
        orderId: 1,
        urlPayment: 'https://payment.com/pay/123',
        qrCodeBase64: 'base64-qr-code',
        qrCodeString: 'qr-code-string',
        expirationDate: new Date(),
      }),
    };

    mockGetOrdersPaginatedUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [OrderFactory.createOrderEntity()],
        total: 1,
        page: 1,
        limit: 10,
      }),
    };

    mockUpdateOrderPaymentUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };

    controller = new OrdersController(
      mockCreateOrderUseCase,
      mockGetOrdersPaginatedUseCase,
      mockUpdateOrderPaymentUseCase,
    );
  });

  describe('create', () => {
    it('should create order and return payment data', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'Bearer valid-token';

      const result = await controller.create(orderData, token);

      expect(result).toBeDefined();
      expect(result.orderId).toBe(1);
      expect(result.urlPayment).toBeDefined();
      expect(mockCreateOrderUseCase.execute).toHaveBeenCalledWith(orderData, token);
    });

    it('should pass Authorization header to use case', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'Bearer abc123';

      await controller.create(orderData, token);

      expect(mockCreateOrderUseCase.execute).toHaveBeenCalledWith(orderData, token);
    });

    it('should pass order DTO to use case', async () => {
      const orderData = OrderFactory.createValidOrderData({
        amount: 150.50,
        observation: 'Special order',
      });
      const token = 'Bearer token';

      await controller.create(orderData, token);

      expect(mockCreateOrderUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 150.50,
          observation: 'Special order',
        }),
        token,
      );
    });
  });

  describe('getOrdersPaginated', () => {
    it('should get paginated orders', async () => {
      const params = { page: 1, limit: 10 };

      const result = await controller.getOrdersPaginated(params);

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should pass page and limit to use case', async () => {
      const params = { page: 2, limit: 20 };

      await controller.getOrdersPaginated(params);

      expect(mockGetOrdersPaginatedUseCase.execute).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
      });
    });

    it('should handle different pagination parameters', async () => {
      const params = { page: 5, limit: 50 };

      await controller.getOrdersPaginated(params);

      expect(mockGetOrdersPaginatedUseCase.execute).toHaveBeenCalledWith({
        page: 5,
        limit: 50,
      });
    });
  });

  describe('updateOrderPayment', () => {
    it('should update order payment status', async () => {
      const params = { orderId: 1 };
      const body = { status: OrderStatus.PAID, transactionId: 'TXN-123' };

      await controller.updateOrderPayment(params, body);

      expect(mockUpdateOrderPaymentUseCase.execute).toHaveBeenCalledWith(params, body);
    });

    it('should pass orderId param to use case', async () => {
      const params = { orderId: 42 };
      const body = { status: OrderStatus.PAID, transactionId: 'TXN-456' };

      await controller.updateOrderPayment(params, body);

      expect(mockUpdateOrderPaymentUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ orderId: 42 }),
        body,
      );
    });

    it('should pass status and transactionId to use case', async () => {
      const params = { orderId: 1 };
      const body = {
        status: OrderStatus.IN_PREPARATION,
        transactionId: 'TXN-789',
      };

      await controller.updateOrderPayment(params, body);

      expect(mockUpdateOrderPaymentUseCase.execute).toHaveBeenCalledWith(
        params,
        expect.objectContaining({
          status: OrderStatus.IN_PREPARATION,
          transactionId: 'TXN-789',
        }),
      );
    });

    it('should handle null transaction ID', async () => {
      const params = { orderId: 1 };
      const body = { status: OrderStatus.FAILED, transactionId: null };

      await controller.updateOrderPayment(params, body);

      expect(mockUpdateOrderPaymentUseCase.execute).toHaveBeenCalledWith(params, body);
    });
  });
});
