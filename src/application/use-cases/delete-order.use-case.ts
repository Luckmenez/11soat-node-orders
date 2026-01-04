import { Inject, Injectable } from '@nestjs/common';
import { DeleteOrderDto } from '../domain/dto/order-delete.dto';
import { PaymentGatewayPort } from '../ports/output/payment.gateway.port';
import { DeleteOrderUseCasePort } from '../ports/input/delete-order.port';
import { OrderRepositoryPort } from '../ports/output/order.repository.port';
import { toNumber } from '../utils/type-conversion.util';

@Injectable()
export class DeleteOrderUseCase implements DeleteOrderUseCasePort {
  constructor(
    @Inject('PaymentGatewayPort')
    private readonly paymentGatewayService: PaymentGatewayPort,
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
  ) {}
  async execute({ orderId }: DeleteOrderDto): Promise<void> {
    const order = await this.orderRepository.findById(
      toNumber(orderId, 'orderId'),
    );

    if (!order) {
      throw new Error('Order not found');
    }

    const deletedOrder = await this.orderRepository.delete(order.id);

    return this.paymentGatewayService.cancelPayment(deletedOrder);
  }
}
