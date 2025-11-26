import { ProductResponseDto } from 'src/application/domain/dto/product-response.dto';

export interface ProductGatewayPort {
  findByIds(productIds: number[]): Promise<ProductResponseDto[]>;
  findById(productId: number): Promise<ProductResponseDto | null>;
}

// {
//     "status": "success",
//     "code": 200,
//     "message": "OK",
//     "data": {
//         "all_available": true | false,
//     }
// }
