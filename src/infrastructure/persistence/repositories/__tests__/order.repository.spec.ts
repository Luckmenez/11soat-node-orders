import { PrismaOrderRepository } from '../order.repository';
import { PrismaService } from '../../prisma.service';
import { OrderEntity } from 'src/application/domain/entities/orders.entity';
import { OrderStatus } from 'src/application/value-objects/order-status.enum';
import { OrderMapper } from '../../mappers/order.mapper';

jest.mock('../../mappers/order.mapper');

describe('PrismaOrderRepository', () => {
  let repository: PrismaOrderRepository;
  let mockPrismaService: any;

  const mockOrderData = {
    id: 1,
    clientCpf: '12345678900',
    status: 'PENDING',
    amount: 100.5,
    transactionId: 'txn_123',
    isRandomClient: false,
    codeClientRandom: null,
    observation: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
  };

  const mockOrderEntity = new OrderEntity(
    1,
    null,
    '12345678900',
    OrderStatus.PENDING,
    100.5,
    [],
    'txn_123',
    false,
    null,
    null,
  );

  beforeEach(() => {
    mockPrismaService = {
      order: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    repository = new PrismaOrderRepository(mockPrismaService);

    (OrderMapper.toEntity as jest.Mock) = jest.fn().mockReturnValue(mockOrderEntity);
    (OrderMapper.toCreateInput as jest.Mock) = jest.fn().mockReturnValue({});
  });

  describe('save', () => {
    it('should save order and return entity', async () => {
      mockPrismaService.order.create.mockResolvedValue(mockOrderData);

      const result = await repository.save(mockOrderEntity);

      expect(OrderMapper.toCreateInput).toHaveBeenCalledWith(mockOrderEntity);
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {},
        include: {
          items: {
            include: {
              customerItems: true,
            },
          },
        },
      });
      expect(OrderMapper.toEntity).toHaveBeenCalledWith(mockOrderData);
      expect(result).toEqual(mockOrderEntity);
    });
  });

  describe('findById', () => {
    it('should find order by id and return entity', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrderData);

      const result = await repository.findById(1);

      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          items: {
            include: {
              customerItems: true,
            },
          },
        },
      });
      expect(OrderMapper.toEntity).toHaveBeenCalledWith(mockOrderData);
      expect(result).toEqual(mockOrderEntity);
    });

    it('should return null when order not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
      expect(OrderMapper.toEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByTransactionId', () => {
    it('should find order by transaction id and return entity', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(mockOrderData);

      const result = await repository.findByTransactionId('txn_123');

      expect(mockPrismaService.order.findFirst).toHaveBeenCalledWith({
        where: { transactionId: 'txn_123' },
        include: {
          items: {
            include: {
              customerItems: true,
            },
          },
        },
      });
      expect(OrderMapper.toEntity).toHaveBeenCalledWith(mockOrderData);
      expect(result).toEqual(mockOrderEntity);
    });

    it('should return null when order not found by transaction id', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      const result = await repository.findByTransactionId('txn_nonexistent');

      expect(result).toBeNull();
      expect(OrderMapper.toEntity).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update order status and return entity', async () => {
      const updatedOrder = {
        ...mockOrderData,
        status: 'CONFIRMED',
        transactionId: 'txn_456',
      };
      mockPrismaService.order.update.mockResolvedValue(updatedOrder);

      const result = await repository.updateStatus(
        1,
        OrderStatus.CONFIRMED,
        'txn_456',
      );

      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: OrderStatus.CONFIRMED, transactionId: 'txn_456' },
        include: {
          items: {
            include: {
              customerItems: true,
            },
          },
        },
      });
      expect(OrderMapper.toEntity).toHaveBeenCalledWith(updatedOrder);
      expect(result).toEqual(mockOrderEntity);
    });
  });

  describe('getPaginatedOrders', () => {
    it('should return paginated orders', async () => {
      const mockOrders = [mockOrderData, { ...mockOrderData, id: 2 }];
      mockPrismaService.$transaction.mockResolvedValue([mockOrders, 2]);

      const result = await repository.getPaginatedOrders(1, 10);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result).toEqual({
        data: [mockOrderEntity, mockOrderEntity],
        total: 2,
        page: 1,
        limit: 10,
      });
    });

    it('should calculate correct skip and take for pagination', async () => {
      mockPrismaService.$transaction.mockResolvedValue([[], 0]);

      await repository.getPaginatedOrders(3, 20);

      const transactionCall = mockPrismaService.$transaction.mock.calls[0][0];
      expect(transactionCall).toHaveLength(2);
    });
  });

  describe('getOrderById', () => {
    it('should get order by id and return entity', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrderData);

      const result = await repository.getOrderById(1);

      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          items: {
            include: {
              customerItems: true,
            },
          },
        },
      });
      expect(OrderMapper.toEntity).toHaveBeenCalledWith(mockOrderData);
      expect(result).toEqual(mockOrderEntity);
    });

    it('should return null when order not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      const result = await repository.getOrderById(999);

      expect(result).toBeNull();
      expect(OrderMapper.toEntity).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should log order id when deleting', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await repository.delete(1);

      expect(consoleSpy).toHaveBeenCalledWith('Deleting order with ID:', 1);

      consoleSpy.mockRestore();
    });
  });
});
