import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'src/application/domain/dto/order.db.interface';
import { OrderEntity } from 'src/application/domain/entities/orders.entity';
import { CreateOrderUseCasePort } from 'src/application/ports/input/order.use-case.port';
import { AppError } from 'src/application/domain/errors/app.error';

@Injectable()
export class CreateOrderUseCase implements CreateOrderUseCasePort {
  async execute({ items }: CreateOrderDto): Promise<OrderEntity | null> {
    const productIds = items.map((item) => item.productId);

    if (!productIds.length) {
      throw AppError.badRequest({
        message: 'At least one product is required in the order',
      });
    }

    //chamada para produtos

    return null;
  }
}
