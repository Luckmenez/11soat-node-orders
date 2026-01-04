import { OrderRepositoryPort } from '../../../src/application/ports/output/order.repository.port';
import { OrderEntity } from '../../../src/application/domain/entities/orders.entity';
import { PaginatedResult } from '../../../src/shared/types/paginated-result.type';
import { OrderFactory } from '../factories/order.factory';

export const createMockOrderRepository = (): jest.Mocked<OrderRepositoryPort> => {
  const mockOrder = OrderFactory.createOrderEntity({ id: 1 });

  return {
    save: jest.fn().mockResolvedValue({ ...mockOrder, id: 1 }),
    findById: jest.fn().mockResolvedValue(mockOrder),
    findByTransactionId: jest.fn().mockResolvedValue(mockOrder),
    updateStatus: jest.fn().mockResolvedValue(mockOrder),
    getPaginatedOrders: jest.fn().mockResolvedValue({
      data: [mockOrder],
      total: 1,
      page: 1,
      limit: 10,
    } as PaginatedResult<OrderEntity>),
    getOrderById: jest.fn().mockResolvedValue(mockOrder),
    delete: jest.fn().mockResolvedValue(mockOrder),
  };
};

export const createMockOrderRepositoryWithError = (): jest.Mocked<OrderRepositoryPort> => {
  return {
    save: jest.fn().mockRejectedValue(new Error('Database error')),
    findById: jest.fn().mockRejectedValue(new Error('Database error')),
    findByTransactionId: jest.fn().mockRejectedValue(new Error('Database error')),
    updateStatus: jest.fn().mockRejectedValue(new Error('Database error')),
    getPaginatedOrders: jest.fn().mockRejectedValue(new Error('Database error')),
    getOrderById: jest.fn().mockRejectedValue(new Error('Database error')),
    delete: jest.fn().mockRejectedValue(new Error('Database error')),
  };
};

export const createMockOrderRepositoryWithNotFound = (): jest.Mocked<OrderRepositoryPort> => {
  return {
    save: jest.fn().mockResolvedValue(OrderFactory.createOrderEntity({ id: 1 })),
    findById: jest.fn().mockResolvedValue(null),
    findByTransactionId: jest.fn().mockResolvedValue(null),
    updateStatus: jest.fn().mockResolvedValue(undefined),
    getPaginatedOrders: jest.fn().mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    } as PaginatedResult<OrderEntity>),
    getOrderById: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(null),
  };
};
