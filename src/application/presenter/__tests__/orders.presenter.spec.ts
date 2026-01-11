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
        amount: 100.5,
      });

      const result = OrderPresenter.toHttp(order);

      expect(typeof result.amount).toBe('number');
      expect(result.amount).toBe(100.5);
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

    it('should handle item with undefined title', () => {
      const order = OrderFactory.createOrderEntity({
        id: 1,
        items: [
          {
            productId: 1,
            title: undefined,
            description: 'Test Description',
            photo: 'http://example.com/photo.jpg',
            quantity: 2,
            price: 50.25,
            unitPrice: 50.25,
            observation: 'No onions',
            type: 'MAIN',
            customerItems: [],
          },
        ],
      });

      const result = OrderPresenter.toHttp(order);

      expect(result.items[0].title).toBe('');
    });

    it('should handle item with undefined description', () => {
      const order = OrderFactory.createOrderEntity({
        id: 1,
        items: [
          {
            productId: 1,
            title: 'Test',
            description: undefined,
            photo: 'http://example.com/photo.jpg',
            quantity: 2,
            price: 50.25,
            unitPrice: 50.25,
            observation: 'No onions',
            type: 'MAIN',
            customerItems: [],
          },
        ],
      });

      const result = OrderPresenter.toHttp(order);

      expect(result.items[0].description).toBe('');
    });

    it('should handle customer items with undefined values', () => {
      const order = OrderFactory.createOrderEntity({
        id: 1,
        items: [
          {
            productId: 1,
            title: 'Test',
            description: 'Desc',
            photo: 'http://example.com/photo.jpg',
            quantity: 2,
            price: 50.25,
            unitPrice: 50.25,
            observation: 'No onions',
            type: 'MAIN',
            customerItems: [
              {
                itemId: 1,
                title: undefined,
                description: undefined,
                photo: undefined,
                quantity: 1,
                price: 5.0,
                unitPrice: undefined,
                observation: undefined,
                type: 'EXTRA',
              },
            ],
          },
        ],
      });

      const result = OrderPresenter.toHttp(order);

      expect(result.items[0].customerItems[0].title).toBe('');
      expect(result.items[0].customerItems[0].description).toBe('');
      expect(result.items[0].customerItems[0].photo).toBe('');
      expect(result.items[0].customerItems[0].observation).toBe('');
      expect(result.items[0].customerItems[0].unitPrice).toBeUndefined();
    });

    it('should handle customer items with defined unitPrice', () => {
      const order = OrderFactory.createOrderEntity({
        id: 1,
        items: [
          {
            productId: 1,
            title: 'Test',
            description: 'Desc',
            photo: 'http://example.com/photo.jpg',
            quantity: 2,
            price: 50.25,
            unitPrice: 50.25,
            observation: 'No onions',
            type: 'MAIN',
            customerItems: [
              {
                itemId: 1,
                title: 'Extra',
                description: 'Desc',
                photo: 'photo.jpg',
                quantity: 1,
                price: 5.0,
                unitPrice: 5.0,
                observation: 'Obs',
                type: 'EXTRA',
              },
            ],
          },
        ],
      });

      const result = OrderPresenter.toHttp(order);

      expect(result.items[0].customerItems[0].unitPrice).toBe(5.0);
    });

    it('should handle undefined customerItems array', () => {
      const order = OrderFactory.createOrderEntity({
        id: 1,
        items: [
          {
            productId: 1,
            title: 'Test',
            description: 'Desc',
            photo: 'http://example.com/photo.jpg',
            quantity: 2,
            price: 50.25,
            unitPrice: 50.25,
            observation: 'No onions',
            type: 'MAIN',
            customerItems: undefined,
          },
        ],
      });

      const result = OrderPresenter.toHttp(order);

      expect(result.items[0].customerItems).toEqual([]);
    });
  });
});
