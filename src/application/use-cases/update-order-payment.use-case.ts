import { Inject, Injectable } from '@nestjs/common';
import { UpdateOrderPaymentPort } from '../ports/input/patch-order-payment.port';
import { UpdateOrderPaymentDto } from '../domain/dto/order.update-payment.dto';
import { OrderRepositoryPort } from '../ports/output/order.repository.port';
import { AppError } from '../domain/errors/app.error';
import { ProductGatewayPort } from '../ports/output/product.gateway.port';

@Injectable()
export class UpdateOrderPaymentUseCase implements UpdateOrderPaymentPort {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
    @Inject('ProductGatewayPort')
    private readonly productGateway: ProductGatewayPort,
  ) {}
  async execute({
    status,
    transactionId,
    orderId,
  }: UpdateOrderPaymentDto): Promise<void> {
    const response = await this.orderRepository.getOrderById(orderId);

    if (!response) {
      throw AppError.notFound({
        message: 'Order not found',
        details: { orderId: orderId },
      });
    }

    const updatedOrder = await this.orderRepository.updateStatus(
      orderId,
      status,
      transactionId,
    );

    const productPayload = updatedOrder.toProduct();

    await this.productGateway.sendToPreparation(productPayload);
  }
}
