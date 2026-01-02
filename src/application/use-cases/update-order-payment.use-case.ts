import { Inject, Injectable } from '@nestjs/common';
import { UpdateOrderPaymentPort } from '../ports/input/patch-order-payment.port';
import {
  UpdateOrderParamPaymentDto,
  UpdateOrderPaymentDto,
} from '../domain/dto/order.update-payment.dto';
import { OrderRepositoryPort } from '../ports/output/order.repository.port';
import { AppError } from '../domain/errors/app.error';
import { toPositiveNumber } from '../utils/type-conversion.util';
import { ProductGatewayPort } from '../ports/output/product.gateway.port';

@Injectable()
export class UpdateOrderPaymentUseCase implements UpdateOrderPaymentPort {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
    @Inject('ProductGatewayPort')
    private readonly productGateway: ProductGatewayPort,
  ) {}
  async execute(
    { orderId }: UpdateOrderParamPaymentDto,
    { status, transactionId }: UpdateOrderPaymentDto,
  ): Promise<void> {
    const orderIdNumber = toPositiveNumber(orderId, 'orderId');

    const response = await this.orderRepository.getOrderById(orderIdNumber);

    if (!response) {
      throw AppError.notFound({
        message: 'Order not found',
        details: { orderId: orderIdNumber },
      });
    }

    const updatedOrder = await this.orderRepository.updateStatus(
      orderIdNumber,
      status,
      transactionId,
    );

    const productPayload = updatedOrder.toProduct();

    await this.productGateway.sendToPreparation(productPayload);
  }
}
