import { OrderEntity } from '../orders.entity';
import { OrderStatus } from '../../../value-objects/order-status.enum';
import { OrderFactory } from '../../../../../test/utils/factories/order.factory';
import { AppError } from '../../errors/app.error';

describe('OrderEntity', () => {
  describe('create', () => {
    it('should create a valid order entity with all required fields', () => {
      const orderData = OrderFactory.createValidOrderData();

      const order = OrderEntity.create(orderData);

      expect(order).toBeInstanceOf(OrderEntity);
      expect(order.clientCpf).toBe('12345678900');
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.amount).toBe(100.50);
      expect(order.items).toHaveLength(1);
      expect(order.items[0].productId).toBe(1);
    });

    it('should throw error when items array is empty', () => {
      const orderData = OrderFactory.createOrderWithInvalidData('emptyItems');

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow(
        'Order must contain at least one item',
      );
    });

    it('should throw error when amount is zero', () => {
      const orderData = OrderFactory.createOrderWithInvalidData('zeroAmount');

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow(
        'Order amount must be greater than zero',
      );
    });

    it('should throw error when amount is negative', () => {
      const orderData = OrderFactory.createOrderWithInvalidData('negativeAmount');

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow(
        'Order amount must be greater than zero',
      );
    });

    it('should throw error when item quantity is zero', () => {
      const orderData = OrderFactory.createOrderWithInvalidData('zeroQuantity');

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow(
        'All items must have a quantity greater than zero',
      );
    });

    it('should throw error when item quantity is negative', () => {
      const orderData = OrderFactory.createOrderWithInvalidData('negativeQuantity');

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow(
        'All items must have a quantity greater than zero',
      );
    });

    it('should throw error when item price is invalid (NaN)', () => {
      const orderData = OrderFactory.createOrderWithInvalidData('invalidPrice');

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow(
        'All items must have a valid price greater than zero',
      );
    });

    it('should throw error when item price is zero', () => {
      const orderData = OrderFactory.createOrderWithInvalidData('zeroPrice');

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow(
        'All items must have a valid price greater than zero',
      );
    });

    it('should throw error when customer item quantity is zero', () => {
      const orderData = OrderFactory.createValidOrderData({
        items: [
          OrderFactory.createValidOrderItem({
            customerItems: [
              {
                itemId: 1,
                title: 'Extra Cheese',
                description: 'Additional cheese',
                photo: null,
                quantity: 0, // Invalid
                price: 5.00,
                unitPrice: 5.00,
                observation: null,
                type: 'EXTRA',
              },
            ],
          }),
        ],
      });

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow(
        'Customer item customizations must have quantity greater than zero',
      );
    });

    it('should throw error when customer item price is invalid', () => {
      const orderData = OrderFactory.createValidOrderData({
        items: [
          OrderFactory.createValidOrderItem({
            customerItems: [
              {
                itemId: 1,
                title: 'Extra Cheese',
                description: 'Additional cheese',
                photo: null,
                quantity: 1,
                price: NaN, // Invalid
                unitPrice: 5.00,
                observation: null,
                type: 'EXTRA',
              },
            ],
          }),
        ],
      });

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow(
        'Customer item customizations must have valid prices greater than zero',
      );
    });

    it('should throw error when customer item price is zero', () => {
      const orderData = OrderFactory.createValidOrderData({
        items: [
          OrderFactory.createValidOrderItem({
            customerItems: [
              {
                itemId: 1,
                title: 'Free Item',
                description: 'No charge',
                photo: null,
                quantity: 1,
                price: 0, // Invalid
                unitPrice: 0,
                observation: null,
                type: 'EXTRA',
              },
            ],
          }),
        ],
      });

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow(
        'Customer item customizations must have valid prices greater than zero',
      );
    });

    it('should throw error when status is invalid', () => {
      const orderData = OrderFactory.createValidOrderData({
        status: 'INVALID_STATUS' as OrderStatus,
      });

      expect(() => OrderEntity.create(orderData)).toThrow(AppError);
      expect(() => OrderEntity.create(orderData)).toThrow('Invalid order status');
    });

    it('should convert clientId from string to number', () => {
      const orderData = OrderFactory.createValidOrderData({
        clientId: '456',
      });

      const order = OrderEntity.create(orderData);

      expect(order.clientId).toBe(456);
      expect(typeof order.clientId).toBe('number');
    });

    it('should handle invalid string clientId by setting it to null', () => {
      const orderData = OrderFactory.createValidOrderData({
        clientId: 'invalid-number',
      });

      const order = OrderEntity.create(orderData);

      expect(order.clientId).toBeNull();
    });

    it('should handle null clientId', () => {
      const orderData = OrderFactory.createValidOrderData({
        clientId: null,
      });

      const order = OrderEntity.create(orderData);

      expect(order.clientId).toBeNull();
    });

    it('should handle undefined clientId', () => {
      const orderData = OrderFactory.createValidOrderData({
        clientId: undefined,
      });

      const order = OrderEntity.create(orderData);

      expect(order.clientId).toBeUndefined();
    });

    it('should create order with multiple items', () => {
      const items = OrderFactory.createMultipleOrderItems(3);
      const orderData = OrderFactory.createValidOrderData({
        items,
        amount: 60, // 10 + 20 + 30
      });

      const order = OrderEntity.create(orderData);

      expect(order.items).toHaveLength(3);
      expect(order.items[0].productId).toBe(1);
      expect(order.items[1].productId).toBe(2);
      expect(order.items[2].productId).toBe(3);
    });

    it('should accept optional fields as null', () => {
      const orderData = OrderFactory.createValidOrderData({
        transactionId: null,
        isRandomClient: false,
        codeClientRandom: null,
        observation: null,
      });

      const order = OrderEntity.create(orderData);

      expect(order.transactionId).toBeNull();
      expect(order.isRandomClient).toBe(false);
      expect(order.codeClientRandom).toBeNull();
      expect(order.observation).toBeNull();
    });
  });

  describe('toProduct', () => {
    it('should transform entity to OrderProductDto correctly', () => {
      const orderData = OrderFactory.createValidOrderData();
      const order = OrderEntity.create(orderData);

      const productDto = order.toProduct();

      expect(productDto).toHaveProperty('clientId');
      expect(productDto).toHaveProperty('amount');
      expect(productDto).toHaveProperty('items');
      expect(productDto).toHaveProperty('observation');
      expect(productDto).toHaveProperty('transactionId');
      expect(productDto.clientId).toBe(order.clientId);
      expect(productDto.amount).toBe(100.50);
      expect(productDto.items).toHaveLength(1);
    });

    it('should convert prices to numbers in toProduct', () => {
      const orderData = OrderFactory.createValidOrderData();
      const order = OrderEntity.create(orderData);

      const productDto = order.toProduct();

      expect(typeof productDto.amount).toBe('number');
      expect(typeof productDto.items[0].price).toBe('number');
    });

    it('should map customer items correctly in toProduct', () => {
      const orderData = OrderFactory.createOrderWithCustomizations();
      const order = OrderEntity.create(orderData);

      const productDto = order.toProduct();

      expect(productDto.items[0].customerItems).toHaveLength(1);
      expect(productDto.items[0].customerItems[0].title).toBe('Extra Cheese');
      expect(productDto.items[0].customerItems[0].quantity).toBe(1);
      expect(typeof productDto.items[0].customerItems[0].price).toBe('number');
    });

    it('should handle empty customer items array', () => {
      const orderData = OrderFactory.createValidOrderData({
        items: [
          OrderFactory.createValidOrderItem({
            customerItems: [],
          }),
        ],
      });
      const order = OrderEntity.create(orderData);

      const productDto = order.toProduct();

      expect(productDto.items[0].customerItems).toEqual([]);
    });

    it('should map all required item fields in toProduct', () => {
      const orderData = OrderFactory.createValidOrderData();
      const order = OrderEntity.create(orderData);

      const productDto = order.toProduct();
      const item = productDto.items[0];

      expect(item).toHaveProperty('productId');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('quantity');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('observation');
      expect(item.productId).toBe(1);
      expect(item.title).toBe('Test Product');
      expect(item.quantity).toBe(2);
    });

    it('should include optional fields in toProduct', () => {
      const orderData = OrderFactory.createValidOrderData({
        codeClientRandom: 12345,
        isRandomClient: true,
        observation: 'Custom observation',
        transactionId: 'TXN-123',
      });
      const order = OrderEntity.create(orderData);

      const productDto = order.toProduct();

      expect(productDto.codeClientRandom).toBe(12345);
      expect(productDto.isRandomClient).toBe(true);
      expect(productDto.observation).toBe('Custom observation');
      expect(productDto.transactionId).toBe('TXN-123');
    });
  });
});
