import { Order, OrderItem, OrderItemCustomization } from '@prisma/client';
import { OrderEntity } from 'src/application/domain/entities/orders.entity';
import { OrderStatus } from 'src/application/value-objects/order-status.enum';

type OrderWithRelations = Order & {
  items: (OrderItem & {
    customerItems: OrderItemCustomization[];
  })[];
};

export class OrderMapper {
  /**
   * Converte modelo de persistência para entidade de domínio
   * @param dbOrder - Registro do banco de dados
   * @returns Entidade de domínio
   */
  static toEntity(dbOrder: OrderWithRelations): OrderEntity {
    return new OrderEntity(
      dbOrder.id,
      null,
      dbOrder.clientCpf,
      dbOrder.status as OrderStatus,
      Number(dbOrder.amount),
      dbOrder.items,
      dbOrder.transactionId,
      dbOrder.isRandomClient,
      dbOrder.codeClientRandom,
      dbOrder.observation,
      undefined,
      dbOrder.createdAt,
      dbOrder.updatedAt,
    );
  }

  /**
   * Converte entidade de domínio para dados de criação no banco
   * @param entity - Entidade de domínio
   * @returns Dados para criar registro no banco
   */
  static toCreateInput(entity: OrderEntity) {
    return {
      clientCpf: entity.clientCpf,
      status: entity.status,
      amount: entity.amount,
      transactionId: entity.transactionId,
      isRandomClient: entity.isRandomClient,
      codeClientRandom: entity.codeClientRandom,
      observation: entity.observation,
      items: {
        create: entity.items.map((item) => ({
          productId: item.productId,
          title: item.title,
          description: item.description,
          photo: item.photo,
          quantity: item.quantity,
          price: item.price,
          unitPrice: item.unitPrice || item.price,
          observation: item.observation,
          type: item.type,
          customerItems: item.customerItems
            ? {
                create: item.customerItems.map((custom) => ({
                  title: custom.title || '',
                  description: custom.description,
                  photo: custom.photo,
                  quantity: custom.quantity,
                  price: custom.price,
                  unitPrice: custom.unitPrice || custom.price,
                  observation: custom.observation,
                  type: custom.type,
                })),
              }
            : undefined,
        })),
      },
    };
  }
}
