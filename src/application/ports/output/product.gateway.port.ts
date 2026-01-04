import { OrderProductDto } from 'src/application/domain/dto/order.product.dto';

export interface ProductGatewayPort {
  sendToPreparation(productIds: OrderProductDto): Promise<void>;
}
