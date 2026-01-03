import { UpdateOrderPaymentDto } from 'src/application/domain/dto/order.update-payment.dto';

export interface UpdateOrderPaymentPort {
  execute(updateOrderPaymentDto: UpdateOrderPaymentDto): Promise<void>;
}
