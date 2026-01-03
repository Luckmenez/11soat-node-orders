import { OrderStatus } from 'src/application/value-objects/order-status.enum';

export class UpdateOrderPaymentDto {
  orderId: number;
  status: OrderStatus;
  transactionId: string;
  amount: number;
}
