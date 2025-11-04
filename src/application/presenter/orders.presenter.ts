import { OrderEntity } from 'src/application/domain/entities/orders.entity';

export class OrderPresenter {
  static toHttp(order: OrderEntity) {
    return {
      ...order,
      items: order.items.map((item) => ({
        id: item.id,
        title: item?.title || '',
        description: item.description || '',
        price: Number(item.price),
        productId: item.productId,
        quantity: item.quantity,
        customerItems: (item.customerItems || []).map((ci) => ({
          ...ci,
          title: ci.title || '',
          description: ci.description || '',
          observation: ci.observation || '',
          photo: ci.photo || '',
          price: Number(ci.price),
          unitPrice: ci.unitPrice ? Number(ci.unitPrice) : undefined,
        })),
      })),
      client: order.client || null,
    };
  }
}
