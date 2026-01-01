import { OrderEntity } from 'src/application/domain/entities/orders.entity';
import { OrderStatus } from 'src/application/value-objects/order-status.enum';
import { PaginatedResult } from 'src/shared/types/paginated-result.type';

export interface OrderRepositoryPort {
  save(order: OrderEntity): Promise<OrderEntity>;
  findById(id: number): Promise<OrderEntity | null>;
  findByTransactionId(transactionId: string): Promise<OrderEntity | null>;
  updateStatus(id: number, status: OrderStatus): Promise<void>;
  getPaginatedOrders(
    page: number,
    limit: number,
  ): Promise<PaginatedResult<OrderEntity>>;
}
