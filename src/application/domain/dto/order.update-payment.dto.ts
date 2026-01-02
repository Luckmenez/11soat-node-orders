import { OrderStatus } from 'src/application/value-objects/order-status.enum';

export class UpdateOrderParamPaymentDto {
  orderId: number;
}

export class UpdateOrderPaymentDto {
  status: OrderStatus;
  transactionId: string;
}
