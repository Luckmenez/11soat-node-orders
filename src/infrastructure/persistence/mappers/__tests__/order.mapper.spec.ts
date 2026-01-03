import { OrderMapper } from '../order.mapper';
import { OrderFactory } from '../../../../../test/utils/factories/order.factory';
import { OrderStatus } from '../../../../application/value-objects/order-status.enum';

describe('OrderMapper', () => {
  describe('toEntity', () => {
    it('should convert database model to entity', () => {
      const dbOrder = {
        id: 1,
        clientCpf: '12345678900',
        status: OrderStatus.PENDING,
        amount: 100.50,
        transactionId: null,
        isRandomClient: false,
        codeClientRandom: null,
        observation: 'Test order',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            title: 'Product 1',
            description: 'Description',
            photo: 'photo.jpg',
            quantity: 2,
            price: 50.25,
            unitPrice: 50.25,
            observation: null,
            type: 'MAIN',
            customerItems: [],
          },
        ],
      };

      const entity = OrderMapper.toEntity(dbOrder as any);

      expect(entity.id).toBe(1);
      expect(entity.clientCpf).toBe('12345678900');
      expect(entity.status).toBe(OrderStatus.PENDING);
      expect(entity.amount).toBe(100.50);
      expect(entity.items).toHaveLength(1);
    });

    it('should convert amount to number', () => {
      const dbOrder = {
        id: 1,
        clientCpf: '12345678900',
        status: OrderStatus.PENDING,
        amount: '100.50', // String from DB
        transactionId: null,
        isRandomClient: false,
        codeClientRandom: null,
        observation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      };

      const entity = OrderMapper.toEntity(dbOrder as any);

      expect(typeof entity.amount).toBe('number');
      expect(entity.amount).toBe(100.50);
    });

    it('should handle nested customer items', () => {
      const dbOrder = {
        id: 1,
        clientCpf: '12345678900',
        status: OrderStatus.PENDING,
        amount: 100,
        transactionId: null,
        isRandomClient: false,
        codeClientRandom: null,
        observation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            title: 'Burger',
            description: 'Delicious',
            photo: 'photo.jpg',
            quantity: 1,
            price: 50,
            unitPrice: 50,
            observation: null,
            type: 'MAIN',
            customerItems: [
              {
                id: 1,
                orderItemId: 1,
                itemId: 1,
                title: 'Extra Cheese',
                description: 'More cheese',
                photo: null,
                quantity: 1,
                price: 5,
                unitPrice: 5,
                observation: null,
                type: 'EXTRA',
              },
            ],
          },
        ],
      };

      const entity = OrderMapper.toEntity(dbOrder as any);

      expect(entity.items[0].customerItems).toHaveLength(1);
    });
  });

  describe('toCreateInput', () => {
    it('should convert entity to Prisma create input', () => {
      const entity = OrderFactory.createOrderEntity({ id: null });

      const input = OrderMapper.toCreateInput(entity);

      expect(input).toHaveProperty('clientCpf');
      expect(input).toHaveProperty('status');
      expect(input).toHaveProperty('amount');
      expect(input).toHaveProperty('items');
    });

    it('should create nested items structure', () => {
      const entity = OrderFactory.createOrderEntity({ id: null });

      const input = OrderMapper.toCreateInput(entity);

      expect(input.items).toHaveProperty('create');
      expect(input.items.create).toBeInstanceOf(Array);
      expect(input.items.create.length).toBeGreaterThan(0);
    });

    it('should create nested customer items when present', () => {
      const orderData = OrderFactory.createOrderWithCustomizations();
      const entity = OrderFactory.createOrderEntity(orderData);

      const input = OrderMapper.toCreateInput(entity);

      const firstItem = input.items.create[0];
      expect(firstItem.customerItems).toHaveProperty('create');
      expect(firstItem.customerItems.create).toBeInstanceOf(Array);
    });

    it('should handle empty customer items', () => {
      const entity = OrderFactory.createOrderEntity({ id: null });

      const input = OrderMapper.toCreateInput(entity);

      const firstItem = input.items.create[0];
      expect(firstItem.customerItems.create).toEqual([]);
    });

    it('should preserve optional fields', () => {
      const entity = OrderFactory.createOrderEntity({
        id: null,
        observation: 'Special request',
        codeClientRandom: 12345,
      });

      const input = OrderMapper.toCreateInput(entity);

      expect(input.observation).toBe('Special request');
      expect(input.codeClientRandom).toBe(12345);
    });

    it('should handle null optional fields', () => {
      const entity = OrderFactory.createOrderEntity({
        id: null,
        observation: null,
        transactionId: null,
      });

      const input = OrderMapper.toCreateInput(entity);

      expect(input.observation).toBeNull();
      expect(input.transactionId).toBeNull();
    });
  });
});
