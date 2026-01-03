import { UpdateOrderPaymentUseCase } from '../update-order-payment.use-case';
import { OrderStatus } from '../../value-objects/order-status.enum';
import { AppError } from '../../domain/errors/app.error';
import {
  createMockOrderRepository,
  createMockOrderRepositoryWithNotFound,
  createMockOrderRepositoryWithError,
} from '../../../../test/utils/mocks/order-repository.mock';
import {
  createMockProductGateway,
  createMockProductGatewayWithError,
} from '../../../../test/utils/mocks/product-gateway.mock';

describe('UpdateOrderPaymentUseCase', () => {
  let useCase: UpdateOrderPaymentUseCase;
  let mockOrderRepository: any;
  let mockProductGateway: any;

  beforeEach(() => {
    mockOrderRepository = createMockOrderRepository();
    mockProductGateway = createMockProductGateway();

    useCase = new UpdateOrderPaymentUseCase(
      mockOrderRepository,
      mockProductGateway,
    );
  });

  describe('execute', () => {
    it('should update order payment status successfully', async () => {
      await useCase.execute(
        { orderId: 1 },
        { status: OrderStatus.PAID, transactionId: 'TXN-123' },
      );

      expect(mockOrderRepository.getOrderById).toHaveBeenCalledWith(1);
      expect(mockOrderRepository.updateStatus).toHaveBeenCalledWith(
        1,
        OrderStatus.PAID,
        'TXN-123',
      );
    });

    it('should send order to product gateway for preparation', async () => {
      await useCase.execute(
        { orderId: 1 },
        { status: OrderStatus.PAID, transactionId: 'TXN-123' },
      );

      expect(mockProductGateway.sendToPreparation).toHaveBeenCalledTimes(1);
    });

    it('should throw 404 error when order is not found', async () => {
      mockOrderRepository = createMockOrderRepositoryWithNotFound();
      useCase = new UpdateOrderPaymentUseCase(
        mockOrderRepository,
        mockProductGateway,
      );

      await expect(
        useCase.execute(
          { orderId: 999 },
          { status: OrderStatus.PAID, transactionId: 'TXN-123' },
        ),
      ).rejects.toThrow('Order not found');

      expect(mockOrderRepository.updateStatus).not.toHaveBeenCalled();
      expect(mockProductGateway.sendToPreparation).not.toHaveBeenCalled();
    });

    it('should throw error when repository update fails', async () => {
      mockOrderRepository = createMockOrderRepositoryWithError();
      useCase = new UpdateOrderPaymentUseCase(
        mockOrderRepository,
        mockProductGateway,
      );

      await expect(
        useCase.execute(
          { orderId: 1 },
          { status: OrderStatus.PAID, transactionId: 'TXN-123' },
        ),
      ).rejects.toThrow('Database error');
    });

    it('should throw error when product gateway fails', async () => {
      mockProductGateway = createMockProductGatewayWithError();
      useCase = new UpdateOrderPaymentUseCase(
        mockOrderRepository,
        mockProductGateway,
      );

      await expect(
        useCase.execute(
          { orderId: 1 },
          { status: OrderStatus.PAID, transactionId: 'TXN-123' },
        ),
      ).rejects.toThrow('Product gateway unavailable');
    });
  });
});
