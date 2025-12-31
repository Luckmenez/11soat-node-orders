import { OrderEntity } from 'src/application/domain/entities/orders.entity';
import { PaginatedResult } from 'src/shared/types/paginated-result.type';

export interface GetOrdersPaginatedPort {
  execute({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<OrderEntity>>;
}
