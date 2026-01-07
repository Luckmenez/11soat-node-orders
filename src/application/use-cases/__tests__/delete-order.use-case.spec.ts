import { DeleteOrderUseCase } from '../delete-order.use-case';
import { DeleteOrderDto } from '../../domain/dto/order-delete.dto';
import { OrderEntity } from '../../domain/entities/orders.entity';
import { OrderStatus } from '../../value-objects/order-status.enum';

describe('DeleteOrderUseCase', () => {
  let useCase: DeleteOrderUseCase;
  let mockPaymentGateway: any;
  let mockOrderRepository: any;

  beforeEach(() => {
    mockPaymentGateway = {
      cancelPayment: jest.fn().mockResolvedValue(undefined),
    };

    mockOrderRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteOrderUseCase(
      mockPaymentGateway,
      mockOrderRepository,
    );
  });

  describe('execute', () => {
    it('should delete order and cancel payment successfully', async () => {
      const orderId = '1';
      const deleteDto: DeleteOrderDto = { orderId };

      const mockOrder = new OrderEntity(
        1,
        123,
        '12345678900',
        OrderStatus.PENDING,
        100.5,
        [],
        'txn_123',
        false,
        null,
        null,
      );

      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.delete.mockResolvedValue({
        transactionId: 'txn_123',
      });

      await useCase.execute(deleteDto);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockOrderRepository.delete).toHaveBeenCalledWith(1);
      expect(mockPaymentGateway.cancelPayment).toHaveBeenCalledWith({
        transactionId: 'txn_123',
      });
    });

    it('should throw error when order not found', async () => {
      const orderId = '999';
      const deleteDto: DeleteOrderDto = { orderId };

      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(deleteDto)).rejects.toThrow(
        'Order not found',
      );

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(999);
      expect(mockOrderRepository.delete).not.toHaveBeenCalled();
      expect(mockPaymentGateway.cancelPayment).not.toHaveBeenCalled();
    });

    it('should handle string orderId by converting to number', async () => {
      const deleteDto: DeleteOrderDto = { orderId: '42' as any };

      const mockOrder = new OrderEntity(
        42,
        123,
        '12345678900',
        OrderStatus.PENDING,
        50.0,
        [],
        'txn_456',
        false,
        null,
        null,
      );

      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.delete.mockResolvedValue({
        transactionId: 'txn_456',
      });

      await useCase.execute(deleteDto);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(42);
      expect(mockOrderRepository.delete).toHaveBeenCalledWith(42);
    });

    it('should call cancelPayment with deleted order result', async () => {
      const orderId = '5';
      const deleteDto: DeleteOrderDto = { orderId };

      const mockOrder = new OrderEntity(
        5,
        100,
        '98765432100',
        OrderStatus.PAID,
        200.0,
        [],
        'txn_789',
        true,
        12345,
        'Test observation',
      );

      const deletedOrderResult = {
        transactionId: 'txn_789',
        status: 'cancelled',
      };

      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.delete.mockResolvedValue(deletedOrderResult);

      await useCase.execute(deleteDto);

      expect(mockPaymentGateway.cancelPayment).toHaveBeenCalledWith(
        deletedOrderResult,
      );
    });

    it('should throw error when repository findById fails', async () => {
      const orderId = '1';
      const deleteDto: DeleteOrderDto = { orderId };

      mockOrderRepository.findById.mockRejectedValue(
        new Error('Database connection error'),
      );

      await expect(useCase.execute(deleteDto)).rejects.toThrow(
        'Database connection error',
      );

      expect(mockOrderRepository.delete).not.toHaveBeenCalled();
      expect(mockPaymentGateway.cancelPayment).not.toHaveBeenCalled();
    });

    it('should throw error when repository delete fails', async () => {
      const orderId = '1';
      const deleteDto: DeleteOrderDto = { orderId };

      const mockOrder = new OrderEntity(
        1,
        123,
        '12345678900',
        OrderStatus.PENDING,
        100.5,
        [],
        'txn_123',
        false,
        null,
        null,
      );

      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.delete.mockRejectedValue(
        new Error('Failed to delete order'),
      );

      await expect(useCase.execute(deleteDto)).rejects.toThrow(
        'Failed to delete order',
      );

      expect(mockPaymentGateway.cancelPayment).not.toHaveBeenCalled();
    });

    it('should throw error when payment cancellation fails', async () => {
      const orderId = '1';
      const deleteDto: DeleteOrderDto = { orderId };

      const mockOrder = new OrderEntity(
        1,
        123,
        '12345678900',
        OrderStatus.PENDING,
        100.5,
        [],
        'txn_123',
        false,
        null,
        null,
      );

      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.delete.mockResolvedValue({
        transactionId: 'txn_123',
      });
      mockPaymentGateway.cancelPayment.mockRejectedValue(
        new Error('Payment service unavailable'),
      );

      await expect(useCase.execute(deleteDto)).rejects.toThrow(
        'Payment service unavailable',
      );
    });
  });
});
