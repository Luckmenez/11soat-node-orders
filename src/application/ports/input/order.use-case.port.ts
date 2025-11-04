import { CreateOrderDto } from 'src/application/domain/dto/order.db.interface';
import { OrderEntity } from 'src/application/domain/entities/orders.entity';

export interface CreateOrderUseCasePort {
  execute(data: CreateOrderDto): Promise<OrderEntity>;
}
