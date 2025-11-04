import { ProductResponseDto } from 'src/application/domain/dto/product-response.dto';

export interface ProductGatewayPort {
  findByIds(productIds: number[]): Promise<ProductResponseDto[]>;
  findById(productId: number): Promise<ProductResponseDto | null>;
}
