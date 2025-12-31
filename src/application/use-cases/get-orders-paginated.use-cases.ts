import { Inject, Injectable } from '@nestjs/common';
import { GetOrdersPaginatedDto } from '../domain/dto/orders-get-paginated.dto';
import { GetOrdersPaginatedPort } from '../ports/input/get-orders-paginated.port';
import { OrderRepositoryPort } from '../ports/output/order.repository.port';
import { PaginatedResult } from 'src/shared/types/paginated-result.type';
import { OrderEntity } from '../domain/entities/orders.entity';

@Injectable()
export class GetOrdersPaginatedUseCase implements GetOrdersPaginatedPort {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
  ) {}
  execute(
    getOrdersPaginatedDto: GetOrdersPaginatedDto,
  ): Promise<PaginatedResult<OrderEntity>> {
    console.log(getOrdersPaginatedDto);

    const orders = this.orderRepository.getPaginatedOrders(
      getOrdersPaginatedDto.page,
      getOrdersPaginatedDto.limit,
    );

    return orders;
  }
}
