import { CreateOrderDto } from 'src/application/domain/dto/order.db.interface';
import { PaymentDtoResponse } from 'src/application/domain/dto/payment.gateway.interface';

export interface CreateOrderUseCasePort {
  execute(data: CreateOrderDto, token: string): Promise<PaymentDtoResponse>;
}
