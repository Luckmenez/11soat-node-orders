import { Order, OrderItem, OrderItemCustomization } from '@prisma/client';
import { OrderEntity } from 'src/application/domain/entities/orders.entity';
import { OrderStatus } from 'src/application/value-objects/order-status.enum';
import {
  OrderItem as OrderItemDto,
  OrderItemCustomer,
} from 'src/application/domain/dto/order.db.interface';

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
      dbOrder.items.map((item) => this.itemToDto(item)),
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
                })),
              }
            : undefined,
        })),
      },
    };
  }

  /**
   * Converte item de pedido do banco para DTO
   */
  private static itemToDto(
    dbItem: OrderItem & { customerItems: OrderItemCustomization[] },
  ): OrderItemDto {
    return {
      id: dbItem.id,
      productId: dbItem.productId,
      title: dbItem.title,
      description: dbItem.description,
      photo: dbItem.photo,
      quantity: dbItem.quantity,
      price: Number(dbItem.price),
      unitPrice: Number(dbItem.unitPrice),
      observation: dbItem.observation,
      customerItems: dbItem.customerItems.map((item) =>
        this.customizationToDto(item),
      ),
    };
  }

  /**
   * Converte customização de item do banco para DTO
   */
  private static customizationToDto(
    dbCustomization: OrderItemCustomization,
  ): OrderItemCustomer {
    return {
      itemId: dbCustomization.id,
      title: dbCustomization.title,
      description: dbCustomization.description,
      photo: dbCustomization.photo,
      quantity: dbCustomization.quantity,
      price: Number(dbCustomization.price),
      unitPrice: Number(dbCustomization.unitPrice),
      observation: dbCustomization.observation,
    };
  }
}
