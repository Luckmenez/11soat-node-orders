import {
  UpdateOrderParamPaymentDto,
  UpdateOrderPaymentDto,
} from 'src/application/domain/dto/order.update-payment.dto';

export interface UpdateOrderPaymentPort {
  execute(
    orderId: UpdateOrderParamPaymentDto,
    updateOrderPaymentDto: UpdateOrderPaymentDto,
  ): Promise<void>;
}
