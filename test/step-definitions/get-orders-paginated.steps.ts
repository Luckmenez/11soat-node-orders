import { loadFeature, defineFeature } from 'jest-cucumber';
import { GetOrdersPaginatedUseCase } from '../../src/application/use-cases/get-orders-paginated.use-cases';
import { OrderFactory } from '../utils/factories/order.factory';
import { PaginatedResult } from '../../src/shared/types/paginated-result.type';
import { OrderEntity } from '../../src/application/domain/entities/orders.entity';

const feature = loadFeature('./test/features/get-orders-paginated.feature');

defineFeature(feature, (test) => {
  let useCase: GetOrdersPaginatedUseCase;
  let mockOrderRepository: any;
  let page: number;
  let limit: number;
  let result: PaginatedResult<OrderEntity>;

  const createMockRepositoryWithOrders = (orderCount: number) => {
    const orders = Array.from({ length: orderCount }, (_, i) =>
      OrderFactory.createOrderEntity({ id: i + 1 }),
    );

    return {
      getPaginatedOrders: jest.fn().mockImplementation(async (p: number, l: number) => {
        const start = (p - 1) * l;
        const end = start + l;
        const paginatedOrders = orders.slice(start, end);

        return {
          data: paginatedOrders,
          total: orderCount,
          page: p,
          limit: l,
        };
      }),
      save: jest.fn(),
      findById: jest.fn(),
      findByTransactionId: jest.fn(),
      updateStatus: jest.fn(),
      getOrderById: jest.fn(),
    };
  };

  test('Successfully retrieve first page of orders', ({ given, when, then, and }) => {
    given('there are 15 orders in the system', () => {
      mockOrderRepository = createMockRepositoryWithOrders(15);
      useCase = new GetOrdersPaginatedUseCase(mockOrderRepository);
    });

    when('I request page 1 with limit 10', async () => {
      page = 1;
      limit = 10;
      result = await useCase.execute({ page, limit });
    });

    then('I should receive 10 orders', () => {
      expect(result.data).toHaveLength(10);
    });

    and('the total count should be 15', () => {
      expect(result.total).toBe(15);
    });

    and('the current page should be 1', () => {
      expect(result.page).toBe(1);
    });
  });

  test('Successfully retrieve second page of orders', ({ given, when, then, and }) => {
    given('there are 15 orders in the system', () => {
      mockOrderRepository = createMockRepositoryWithOrders(15);
      useCase = new GetOrdersPaginatedUseCase(mockOrderRepository);
    });

    when('I request page 2 with limit 10', async () => {
      page = 2;
      limit = 10;
      result = await useCase.execute({ page, limit });
    });

    then('I should receive 5 orders', () => {
      expect(result.data).toHaveLength(5);
    });

    and('the total count should be 15', () => {
      expect(result.total).toBe(15);
    });

    and('the current page should be 2', () => {
      expect(result.page).toBe(2);
    });
  });

  test('Retrieve empty page when no orders exist', ({ given, when, then, and }) => {
    given('there are no orders in the system', () => {
      mockOrderRepository = createMockRepositoryWithOrders(0);
      useCase = new GetOrdersPaginatedUseCase(mockOrderRepository);
    });

    when('I request page 1 with limit 10', async () => {
      page = 1;
      limit = 10;
      result = await useCase.execute({ page, limit });
    });

    then('I should receive 0 orders', () => {
      expect(result.data).toHaveLength(0);
    });

    and('the total count should be 0', () => {
      expect(result.total).toBe(0);
    });
  });

  test('Retrieve page beyond available data', ({ given, when, then, and }) => {
    given('there are 5 orders in the system', () => {
      mockOrderRepository = createMockRepositoryWithOrders(5);
      useCase = new GetOrdersPaginatedUseCase(mockOrderRepository);
    });

    when('I request page 3 with limit 10', async () => {
      page = 3;
      limit = 10;
      result = await useCase.execute({ page, limit });
    });

    then('I should receive 0 orders', () => {
      expect(result.data).toHaveLength(0);
    });

    and('the total count should be 5', () => {
      expect(result.total).toBe(5);
    });

    and('the current page should be 3', () => {
      expect(result.page).toBe(3);
    });
  });
});
