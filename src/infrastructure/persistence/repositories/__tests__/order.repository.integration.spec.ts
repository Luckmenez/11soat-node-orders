import { PrismaOrderRepository } from '../order.repository';
import { PrismaService } from '../../prisma.service';
import { OrderEntity } from '../../../../application/domain/entities/orders.entity';
import { OrderStatus } from '../../../../application/value-objects/order-status.enum';
import { OrderFactory } from '../../../../../test/utils/factories/order.factory';

describe('OrderRepository Integration Tests', () => {
  let repository: PrismaOrderRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Usar PrismaService real conectado ao banco de testes
    prisma = new PrismaService();
    await prisma.$connect();
    repository = new PrismaOrderRepository(prisma);
  });

  afterEach(async () => {
    // Limpar dados após cada teste
    await prisma.orderItemCustomization.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('save', () => {
    it('should save order with items to database', async () => {
      // Arrange
      const orderData = OrderFactory.createValidOrderData();
      orderData.id = null; // Novo pedido
      const entity = OrderFactory.createOrderEntity(orderData);

      // Act
      const savedOrder = await repository.save(entity);

      // Assert
      expect(savedOrder.id).toBeDefined();
      expect(savedOrder.id).toBeGreaterThan(0);
      expect(savedOrder.clientCpf).toBe(orderData.clientCpf);
      expect(savedOrder.amount).toBe(orderData.amount);
      expect(savedOrder.items).toBeDefined();
      expect(savedOrder.items.length).toBeGreaterThan(0);

      // Verificar no banco de dados
      const dbOrder = await prisma.order.findUnique({
        where: { id: savedOrder.id },
        include: { items: true },
      });

      expect(dbOrder).toBeDefined();
      expect(dbOrder!.clientCpf).toBe(orderData.clientCpf);
      expect(dbOrder!.items.length).toBe(orderData.items.length);
    });

    it('should save order with customer customizations', async () => {
      // Arrange
      const orderData = OrderFactory.createOrderWithCustomizations();
      orderData.id = null;
      const entity = OrderFactory.createOrderEntity(orderData);

      // Act
      const savedOrder = await repository.save(entity);

      // Assert
      expect(savedOrder.id).toBeDefined();
      expect(savedOrder.items[0].customerItems).toBeDefined();
      expect(savedOrder.items[0].customerItems!.length).toBeGreaterThan(0);

      // Verificar no banco
      const dbOrder = await prisma.order.findUnique({
        where: { id: savedOrder.id },
        include: {
          items: {
            include: { customerItems: true },
          },
        },
      });

      expect(dbOrder!.items[0].customerItems.length).toBeGreaterThan(0);
    });

    it('should save order with random client', async () => {
      // Arrange
      const orderData = OrderFactory.createValidOrderData();
      orderData.id = null;
      orderData.isRandomClient = true;
      orderData.codeClientRandom = 12345;
      orderData.clientCpf = null;
      const entity = OrderFactory.createOrderEntity(orderData);

      // Act
      const savedOrder = await repository.save(entity);

      // Assert
      expect(savedOrder.id).toBeDefined();
      expect(savedOrder.isRandomClient).toBe(true);
      expect(savedOrder.codeClientRandom).toBe(12345);
    });

    it('should preserve order observation', async () => {
      // Arrange
      const orderData = OrderFactory.createValidOrderData();
      orderData.id = null;
      orderData.observation = 'No onions, extra cheese';
      const entity = OrderFactory.createOrderEntity(orderData);

      // Act
      const savedOrder = await repository.save(entity);

      // Assert
      expect(savedOrder.observation).toBe('No onions, extra cheese');
    });
  });

  describe('findById', () => {
    it('should return order when exists', async () => {
      // Arrange: Criar order no banco
      const orderData = OrderFactory.createValidOrderData();
      orderData.id = null;
      const entity = OrderFactory.createOrderEntity(orderData);
      const created = await repository.save(entity);

      // Act
      const found = await repository.findById(created.id!);

      // Assert
      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
      expect(found!.clientCpf).toBe(created.clientCpf);
      expect(found!.amount).toBe(created.amount);
    });

    it('should return null when order does not exist', async () => {
      // Act
      const found = await repository.findById(999999);

      // Assert
      expect(found).toBeNull();
    });

    it('should include items and customer items', async () => {
      // Arrange
      const orderData = OrderFactory.createOrderWithCustomizations();
      orderData.id = null;
      const entity = OrderFactory.createOrderEntity(orderData);
      const created = await repository.save(entity);

      // Act
      const found = await repository.findById(created.id!);

      // Assert
      expect(found!.items).toBeDefined();
      expect(found!.items.length).toBeGreaterThan(0);
      expect(found!.items[0].customerItems).toBeDefined();
    });
  });

  describe('findByTransactionId', () => {
    it('should return order by transaction ID', async () => {
      // Arrange
      const orderData = OrderFactory.createValidOrderData();
      orderData.id = null;
      orderData.transactionId = 'TXN-INTEGRATION-123';
      const entity = OrderFactory.createOrderEntity(orderData);
      await repository.save(entity);

      // Act
      const found = await repository.findByTransactionId('TXN-INTEGRATION-123');

      // Assert
      expect(found).toBeDefined();
      expect(found!.transactionId).toBe('TXN-INTEGRATION-123');
    });

    it('should return null when transaction ID not found', async () => {
      // Act
      const found = await repository.findByTransactionId('NON-EXISTENT');

      // Assert
      expect(found).toBeNull();
    });

    it('should return first order when multiple with same transaction ID', async () => {
      // Arrange: Criar 2 orders com mesmo transactionId (não deveria acontecer, mas testando)
      const orderData1 = OrderFactory.createValidOrderData();
      orderData1.id = null;
      orderData1.transactionId = 'TXN-DUPLICATE';
      const entity1 = OrderFactory.createOrderEntity(orderData1);
      await repository.save(entity1);

      const orderData2 = OrderFactory.createValidOrderData();
      orderData2.id = null;
      orderData2.transactionId = 'TXN-DUPLICATE';
      const entity2 = OrderFactory.createOrderEntity(orderData2);
      await repository.save(entity2);

      // Act
      const found = await repository.findByTransactionId('TXN-DUPLICATE');

      // Assert
      expect(found).toBeDefined();
      expect(found!.transactionId).toBe('TXN-DUPLICATE');
    });
  });

  describe('updateStatus', () => {
    it('should update order status and transaction ID', async () => {
      // Arrange
      const orderData = OrderFactory.createValidOrderData();
      orderData.id = null;
      orderData.status = OrderStatus.PENDING;
      const entity = OrderFactory.createOrderEntity(orderData);
      const created = await repository.save(entity);

      // Act
      const updated = await repository.updateStatus(
        created.id!,
        OrderStatus.PAID,
        'TXN-UPDATE-123',
      );

      // Assert
      expect(updated.id).toBe(created.id);
      expect(updated.status).toBe(OrderStatus.PAID);
      expect(updated.transactionId).toBe('TXN-UPDATE-123');

      // Verificar no banco
      const dbOrder = await prisma.order.findUnique({
        where: { id: created.id },
      });

      expect(dbOrder!.status).toBe(OrderStatus.PAID);
      expect(dbOrder!.transactionId).toBe('TXN-UPDATE-123');
    });

    it('should preserve other order fields when updating status', async () => {
      // Arrange
      const orderData = OrderFactory.createValidOrderData();
      orderData.id = null;
      orderData.observation = 'Special instructions';
      const entity = OrderFactory.createOrderEntity(orderData);
      const created = await repository.save(entity);

      // Act
      const updated = await repository.updateStatus(
        created.id!,
        OrderStatus.PREPARING,
        'TXN-456',
      );

      // Assert
      expect(updated.observation).toBe('Special instructions');
      expect(updated.clientCpf).toBe(created.clientCpf);
      expect(updated.amount).toBe(created.amount);
    });

    it('should throw error when order does not exist', async () => {
      // Act & Assert
      await expect(
        repository.updateStatus(999999, OrderStatus.PAID, 'TXN-999'),
      ).rejects.toThrow();
    });
  });

  describe('getPaginatedOrders', () => {
    beforeEach(async () => {
      // Criar 15 orders para testar paginação
      for (let i = 0; i < 15; i++) {
        const orderData = OrderFactory.createValidOrderData();
        orderData.id = null;
        orderData.clientCpf = `1234567890${i}`;
        orderData.amount = 50 + i;
        const entity = OrderFactory.createOrderEntity(orderData);
        await repository.save(entity);
      }
    });

    it('should return first page of orders', async () => {
      // Act
      const result = await repository.getPaginatedOrders(1, 10);

      // Assert
      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(15);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should return second page of orders', async () => {
      // Act
      const result = await repository.getPaginatedOrders(2, 10);

      // Assert
      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(15);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
    });

    it('should return empty page when beyond available data', async () => {
      // Act
      const result = await repository.getPaginatedOrders(3, 10);

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(15);
      expect(result.page).toBe(3);
    });

    it('should handle different page sizes', async () => {
      // Act
      const result = await repository.getPaginatedOrders(1, 5);

      // Assert
      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(15);
      expect(result.limit).toBe(5);
    });

    it('should return all orders when limit exceeds total', async () => {
      // Act
      const result = await repository.getPaginatedOrders(1, 100);

      // Assert
      expect(result.data).toHaveLength(15);
      expect(result.total).toBe(15);
    });
  });

  describe('getOrderById', () => {
    it('should return order by ID', async () => {
      // Arrange
      const orderData = OrderFactory.createValidOrderData();
      orderData.id = null;
      const entity = OrderFactory.createOrderEntity(orderData);
      const created = await repository.save(entity);

      // Act
      const found = await repository.getOrderById(created.id!);

      // Assert
      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
    });

    it('should return null when order does not exist', async () => {
      // Act
      const found = await repository.getOrderById(888888);

      // Assert
      expect(found).toBeNull();
    });

    it('should include all relations', async () => {
      // Arrange
      const orderData = OrderFactory.createOrderWithCustomizations();
      orderData.id = null;
      const entity = OrderFactory.createOrderEntity(orderData);
      const created = await repository.save(entity);

      // Act
      const found = await repository.getOrderById(created.id!);

      // Assert
      expect(found!.items).toBeDefined();
      expect(found!.items.length).toBeGreaterThan(0);
      expect(found!.items[0].customerItems).toBeDefined();
    });
  });

  describe('Order lifecycle integration', () => {
    it('should complete full order lifecycle', async () => {
      // 1. Create order
      const orderData = OrderFactory.createValidOrderData();
      orderData.id = null;
      orderData.status = OrderStatus.PENDING;
      const entity = OrderFactory.createOrderEntity(orderData);
      const created = await repository.save(entity);

      expect(created.id).toBeDefined();
      expect(created.status).toBe(OrderStatus.PENDING);

      // 2. Find by ID
      const found = await repository.findById(created.id!);
      expect(found).toBeDefined();

      // 3. Update to PAID
      const paid = await repository.updateStatus(
        created.id!,
        OrderStatus.PAID,
        'TXN-LIFECYCLE-123',
      );
      expect(paid.status).toBe(OrderStatus.PAID);

      // 4. Find by transaction ID
      const foundByTxn = await repository.findByTransactionId('TXN-LIFECYCLE-123');
      expect(foundByTxn).toBeDefined();
      expect(foundByTxn!.id).toBe(created.id);

      // 5. Update to PREPARING
      const preparing = await repository.updateStatus(
        created.id!,
        OrderStatus.PREPARING,
        'TXN-LIFECYCLE-123',
      );
      expect(preparing.status).toBe(OrderStatus.PREPARING);

      // 6. Verify in paginated list
      const paginated = await repository.getPaginatedOrders(1, 10);
      const orderInList = paginated.data.find((o) => o.id === created.id);
      expect(orderInList).toBeDefined();
      expect(orderInList!.status).toBe(OrderStatus.PREPARING);
    });
  });
});
