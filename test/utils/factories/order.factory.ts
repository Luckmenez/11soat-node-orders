import { OrderStatus } from '../../../src/application/value-objects/order-status.enum';
import { OrderEntity } from '../../../src/application/domain/entities/orders.entity';
import { OrderItem } from '../../../src/application/domain/dto/order.db.interface';

export class OrderFactory {
  static createValidOrderData(overrides?: Partial<any>) {
    return {
      id: null,
      clientCpf: '12345678900',
      status: OrderStatus.PENDING,
      amount: 100.50,
      items: [this.createValidOrderItem()],
      transactionId: null,
      isRandomClient: false,
      codeClientRandom: null,
      observation: 'Test observation',
      clientId: 1,
      ...overrides,
    };
  }

  static createValidOrderItem(overrides?: Partial<OrderItem>): OrderItem {
    return {
      productId: 1,
      title: 'Test Product',
      description: 'Test Description',
      photo: 'http://example.com/photo.jpg',
      quantity: 2,
      price: 50.25,
      unitPrice: 50.25,
      observation: 'No onions',
      type: 'MAIN',
      customerItems: [],
      ...overrides,
    };
  }

  static createOrderEntity(overrides?: Partial<any>): OrderEntity {
    const data = this.createValidOrderData(overrides);
    return OrderEntity.create(data);
  }

  static createOrderWithCustomizations() {
    const itemWithCustomizations = this.createValidOrderItem({
      customerItems: [
        {
          itemId: 1,
          title: 'Extra Cheese',
          description: 'Additional cheese',
          photo: null,
          quantity: 1,
          price: 5.00,
          unitPrice: 5.00,
          observation: null,
          type: 'EXTRA',
        },
      ],
    });

    return this.createValidOrderData({
      items: [itemWithCustomizations],
      amount: 55.25,
    });
  }

  static createMultipleOrderItems(count: number): OrderItem[] {
    const items: OrderItem[] = [];
    for (let i = 0; i < count; i++) {
      items.push(
        this.createValidOrderItem({
          productId: i + 1,
          title: `Product ${i + 1}`,
          price: (i + 1) * 10,
          unitPrice: (i + 1) * 10,
        }),
      );
    }
    return items;
  }

  static createOrderWithStatus(status: OrderStatus) {
    return this.createValidOrderData({
      status,
    });
  }

  static createOrderWithInvalidData(invalidField: string) {
    const data = this.createValidOrderData();

    switch (invalidField) {
      case 'emptyItems':
        data.items = [];
        break;
      case 'zeroAmount':
        data.amount = 0;
        break;
      case 'negativeAmount':
        data.amount = -100;
        break;
      case 'zeroQuantity':
        data.items[0].quantity = 0;
        break;
      case 'negativeQuantity':
        data.items[0].quantity = -1;
        break;
      case 'invalidPrice':
        data.items[0].price = NaN;
        break;
      case 'zeroPrice':
        data.items[0].price = 0;
        break;
      case 'invalidItemQuantity':
        data.items[0].quantity = -1;
        break;
      default:
        break;
    }

    return data;
  }
}
