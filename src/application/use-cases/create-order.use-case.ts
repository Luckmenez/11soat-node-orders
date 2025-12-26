import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'src/application/domain/dto/order.db.interface';
import { OrderEntity } from 'src/application/domain/entities/orders.entity';
import { CreateOrderUseCasePort } from 'src/application/ports/input/order.use-case.port';
import { AppError } from 'src/application/domain/errors/app.error';
import { AuthGatewayPort } from '../ports/output/auth.gateway.port';
import { OrderRepositoryPort } from '../ports/output/order.repository.port';
import { OrderStatus } from 'src/application/value-objects/order-status.enum';

@Injectable()
export class CreateOrderUseCase implements CreateOrderUseCasePort {
  constructor(
    @Inject('AuthGatewayPort')
    private readonly authGateway: AuthGatewayPort,
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
  ) {}
  async execute(
    orderData: CreateOrderDto,
    token: string,
  ): Promise<OrderEntity | null> {
    const productIds = orderData.items.map((item) => item.productId);

    if (!productIds.length) {
      throw AppError.badRequest({
        message: 'At least one product is required in the order',
      });
    }

    const tokenPayload = await this.authGateway.decodeToken(token);

    const orderEntity = OrderEntity.create({
      clientCpf: tokenPayload?.cpf,
      status: OrderStatus.PENDING,
      amount: orderData.amount,
      items: orderData.items,
      isRandomClient: tokenPayload?.sub ? true : false,
      codeClientRandom: orderData.codeClientRandom,
      observation: orderData.observation,
    });

    const order = await this.orderRepository.save(orderEntity);

    // mandar para pagamento response

    // return response

    return order;
  }
}
