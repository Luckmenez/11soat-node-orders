import { DeleteOrderDto } from 'src/application/domain/dto/order-delete.dto';

export interface DeleteOrderUseCasePort {
  execute(deleteOrderDto: DeleteOrderDto): Promise<void>;
}
