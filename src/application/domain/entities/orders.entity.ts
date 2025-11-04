import { OrderStatus } from 'src/application/value-objects/order-status.enum';
import { ClientEntity } from 'src/application/domain/entities/clients.entitity';
import { OrderItem } from 'src/application/domain/dto/order.db.interface';
import { PaymentDtoResponse } from 'src/application/domain/dto/payment.db.interface';

export class OrderEntity {
  constructor(
    public readonly id: number | null,
    public readonly clientId: number | null | undefined,
    public readonly client: ClientEntity | null,
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

  static create(props: {
    clientId?: number | null;
    client?: ClientEntity | null;
    status: OrderStatus;
    amount: number;
    items: OrderItem[];
    transactionId?: string | null;
    isRandomClient?: boolean;
    codeClientRandom?: number | null;
    observation?: string | null;
  }): OrderEntity {
    return new OrderEntity(
      null,
      props.clientId ?? null,
      props.client ?? null,
      props.status,
      props.amount,
      props.items,
      props.transactionId ?? null,
      props.isRandomClient ?? false,
      props.codeClientRandom ?? null,
      props.observation ?? null,
    );
  }
}
