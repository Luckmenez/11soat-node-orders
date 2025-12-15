import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'src/application/domain/dto/order.db.interface';
import { OrderEntity } from 'src/application/domain/entities/orders.entity';
import { CreateOrderUseCasePort } from 'src/application/ports/input/order.use-case.port';
import { AppError } from 'src/application/domain/errors/app.error';
import { AuthGatewayPort } from '../ports/output/auth.gateway.port';

@Injectable()
export class CreateOrderUseCase implements CreateOrderUseCasePort {
  constructor(
    @Inject('AuthGatewayPort')
    private readonly authGateway: AuthGatewayPort,
  ) {}
  async execute(
    { items }: CreateOrderDto,
    token: string,
  ): Promise<OrderEntity | null> {
    const productIds = items.map((item) => item.productId);

    if (!productIds.length) {
      throw AppError.badRequest({
        message: 'At least one product is required in the order',
      });
    }

    const tokenPayload = await this.authGateway.decodeToken(token);

    console.log(tokenPayload);

    //chamada para pagamento

    return null;
  }
}
