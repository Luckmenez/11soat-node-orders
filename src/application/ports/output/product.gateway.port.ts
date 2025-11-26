import { ProductValidateResponse } from 'src/application/domain/dto/product-response.dto';

export interface ProductGatewayPort {
  validateProducts(productIds: string[]): Promise<ProductValidateResponse>;
}

