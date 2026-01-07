import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'src/application/domain/dto/order.db.interface';
import { OrderEntity } from 'src/application/domain/entities/orders.entity';
import { CreateOrderUseCasePort } from 'src/application/ports/input/create-order.port';
import { AuthGatewayPort } from '../ports/output/auth.gateway.port';
import { OrderRepositoryPort } from '../ports/output/order.repository.port';
import { OrderStatus } from 'src/application/value-objects/order-status.enum';
import { PaymentGatewayPort } from '../ports/output/payment.gateway.port';
import { PaymentDtoResponse } from '../domain/dto/payment-create.gateway.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateOrderUseCase implements CreateOrderUseCasePort {
  constructor(
    private readonly configService: ConfigService,
    @Inject('AuthGatewayPort')
    private readonly authGateway: AuthGatewayPort,
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
    @Inject('PaymentGatewayPort')
    private readonly paymentGateway: PaymentGatewayPort,
  ) {
    this.configService = configService.get('ORDER_GATEWAY_URL');
  }
  async execute(
    orderData: CreateOrderDto,
    token: string,
  ): Promise<PaymentDtoResponse> {
    const tokenPayload = await this.authGateway.decodeToken(token);

    const orderEntity = OrderEntity.create({
      id: null,
      clientCpf: tokenPayload?.cpf,
      status: OrderStatus.PENDING,
      amount: orderData.amount,
      items: orderData.items,
      isRandomClient: tokenPayload?.sub ? true : false,
      codeClientRandom: orderData.codeClientRandom,
      observation: orderData.observation,
      clientId: tokenPayload?.sub || null,
    });

    const createdOrder = await this.orderRepository.save(orderEntity);

    const paymentData = await this.paymentGateway.createPayment({
      orderId: createdOrder.id,
      description: `Pagamento do pedido #${createdOrder.id}`,
      amount: createdOrder.amount,
      client: {
        id: Number(tokenPayload?.sub),
        name: tokenPayload?.name,
        email: tokenPayload?.email,
        document: tokenPayload?.cpf,
      },
      callbackUrl: `${this.configService}/orders/update-order-payment/${createdOrder.id}`,
      items: createdOrder.items.map((item) => ({
        id: item.productId,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.price,
        description: item.description,
        type: item.type,
      })),
    });

    return {
      ...paymentData,
      orderId: createdOrder.id,
    };
  }
}
