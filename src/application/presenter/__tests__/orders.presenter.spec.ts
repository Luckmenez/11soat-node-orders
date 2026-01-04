import { OrderPresenter } from '../orders.presenter';
import { OrderFactory } from '../../../../test/utils/factories/order.factory';

describe('OrderPresenter', () => {
  describe('toHttp', () => {
    it('should transform order entity to HTTP response', () => {
      const order = OrderFactory.createOrderEntity({ id: 1 });

      const result = OrderPresenter.toHttp(order);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('client');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('amount');
      expect(result).toHaveProperty('items');
    });

    it('should convert prices to numbers', () => {
      const order = OrderFactory.createOrderEntity({
        id: 1,
        amount: 100.50,
      });

      const result = OrderPresenter.toHttp(order);

      expect(typeof result.amount).toBe('number');
      expect(result.amount).toBe(100.50);
    });

    it('should map items correctly', () => {
      const order = OrderFactory.createOrderEntity({ id: 1 });

      const result = OrderPresenter.toHttp(order);

      expect(result.items).toBeInstanceOf(Array);
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items[0]).toHaveProperty('productId');
      expect(result.items[0]).toHaveProperty('title');
      expect(result.items[0]).toHaveProperty('quantity');
      expect(result.items[0]).toHaveProperty('price');
    });

    it('should map customer items when present', () => {
      const orderData = OrderFactory.createOrderWithCustomizations();
      const order = OrderFactory.createOrderEntity(orderData);

      const result = OrderPresenter.toHttp(order);

      expect(result.items[0].customerItems).toBeDefined();
      expect(result.items[0].customerItems.length).toBeGreaterThan(0);
    });

    it('should handle empty customer items array', () => {
      const order = OrderFactory.createOrderEntity({ id: 1 });

      const result = OrderPresenter.toHttp(order);

      expect(result.items[0].customerItems).toBeDefined();
    });

    it('should set client from clientCpf', () => {
      const order = OrderFactory.createOrderEntity({
        id: 1,
        clientCpf: '12345678900',
      });

      const result = OrderPresenter.toHttp(order);

      expect(result.client).toBe('12345678900');
    });

    it('should handle null clientCpf', () => {
      const order = OrderFactory.createOrderEntity({
        id: 1,
        clientCpf: null,
      });

      const result = OrderPresenter.toHttp(order);

      expect(result.client).toBeNull();
    });
  });
});
