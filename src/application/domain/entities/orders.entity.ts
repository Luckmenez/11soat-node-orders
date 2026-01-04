import { OrderStatus } from 'src/application/value-objects/order-status.enum';
import { OrderItem } from 'src/application/domain/dto/order.db.interface';
import { PaymentDtoResponse } from '../dto/payment-create.gateway.interface';
import { OrderProductDto, OrderProductItemDto } from '../dto/order.product.dto';
import { AppError } from '../errors/app.error';

export class OrderEntity {
  constructor(
    public readonly id: number,
    public readonly clientId: number | null | undefined,
    public readonly clientCpf: string | null,
    public readonly status: OrderStatus,
    public readonly amount: number,
    public readonly items: OrderItem[],
    public readonly transactionId: string | null = null,
    public readonly isRandomClient: boolean = false,
    public readonly codeClientRandom: number | null = null,
    public readonly observation: string | null = null,
    public readonly payment?: PaymentDtoResponse | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  private static validateItems(items: OrderItem[]): void {
    if (!items || items.length === 0) {
      throw AppError.badRequest({
        message: 'Order must contain at least one item',
      });
    }
  }

  private static validateAmount(amount: number): void {
    if (amount <= 0) {
      throw AppError.badRequest({
        message: 'Order amount must be greater than zero',
        details: { amount },
      });
    }
  }

  private static validateItemQuantities(items: OrderItem[]): void {
    const invalidQuantities = items.filter((item) => item.quantity <= 0);
    if (invalidQuantities.length > 0) {
      throw AppError.badRequest({
        message: 'All items must have a quantity greater than zero',
        details: {
          invalidItems: invalidQuantities.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
      });
    }
  }

  private static validateItemPrices(items: OrderItem[]): void {
    const invalidPrices = items.filter((item) => {
      const price = Number(item.price);
      return isNaN(price) || price <= 0;
    });

    if (invalidPrices.length > 0) {
      throw AppError.badRequest({
        message: 'All items must have a valid price greater than zero',
        details: {
          invalidItems: invalidPrices.map((i) => ({
            productId: i.productId,
            price: i.price,
          })),
        },
      });
    }
  }

  private static validateCustomerItems(items: OrderItem[]): void {
    items.forEach((item) => {
      if (item.customerItems && item.customerItems.length > 0) {
        const invalidCustomerQuantities = item.customerItems.filter(
          (ci) => ci.quantity <= 0,
        );
        if (invalidCustomerQuantities.length > 0) {
          throw AppError.badRequest({
            message:
              'Customer item customizations must have quantity greater than zero',
            details: {
              productId: item.productId,
              invalidCustomizations: invalidCustomerQuantities,
            },
          });
        }

        const invalidCustomerPrices = item.customerItems.filter((ci) => {
          const price = Number(ci.price);
          return isNaN(price) || price <= 0;
        });

        if (invalidCustomerPrices.length > 0) {
          throw AppError.badRequest({
            message:
              'Customer item customizations must have valid prices greater than zero',
            details: {
              productId: item.productId,
              invalidCustomizations: invalidCustomerPrices,
            },
          });
        }
      }
    });
  }

  private static validateStatus(status: OrderStatus): void {
    if (!Object.values(OrderStatus).includes(status)) {
      throw AppError.badRequest({
        message: 'Invalid order status',
        details: { status },
      });
    }
  }

  static addTransactionId(
    order: OrderEntity,
    transactionId: string,
  ): OrderEntity {
    return new OrderEntity(
      order.id,
      order.clientId,
      order.clientCpf,
      order.status,
      order.amount,
      order.items,
      transactionId,
      order.isRandomClient,
      order.codeClientRandom,
      order.observation,
      order.payment,
      order.createdAt,
      order.updatedAt,
    );
  }

  static create(props: {
    id: number | null;
    clientCpf?: string | null;
    status: OrderStatus;
    amount: number;
    items: OrderItem[];
    transactionId?: string | null;
    isRandomClient?: boolean;
    codeClientRandom?: number | null;
    observation?: string | null;
    clientId: string | number | null;
  }): OrderEntity {
    this.validateStatus(props.status);
    this.validateItems(props.items);
    this.validateAmount(props.amount);
    this.validateItemQuantities(props.items);
    this.validateItemPrices(props.items);
    this.validateCustomerItems(props.items);

    const clientIdNumber =
      typeof props.clientId === 'string'
        ? parseInt(props.clientId, 10) || null
        : props.clientId;

    return new OrderEntity(
      props.id ?? null,
      clientIdNumber,
      props.clientCpf ?? null,
      props.status,
      props.amount,
      props.items,
      props.transactionId ?? null,
      props.isRandomClient ?? false,
      props.codeClientRandom ?? null,
      props.observation ?? null,
    );
  }

  toProduct(): OrderProductDto {
    const items: OrderProductItemDto[] = this.items.map((item) => ({
      productId: item.productId,
      title: item.title,
      quantity: item.quantity,
      price: Number(item.price),
      observation: item.observation,
      customerItems: item.customerItems?.map((customerItem) => ({
        itemId: customerItem.itemId,
        title: customerItem.title,
        quantity: customerItem.quantity,
        price: Number(customerItem.price),
        observation: customerItem.observation,
      })),
    }));

    return {
      clientId: this.clientId,
      codeClientRandom: this.codeClientRandom,
      isRandomClient: this.isRandomClient,
      amount: Number(this.amount),
      observation: this.observation,
      transactionId: this.transactionId,
      items,
    };
  }
}
