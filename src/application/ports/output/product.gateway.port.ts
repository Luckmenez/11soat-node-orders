import { ProductValidateResponse } from 'src/application/domain/dto/product-response.dto';

export interface ProductGatewayPort {
  validateProducts(productIds: string[]): Promise<ProductValidateResponse>;
}

// {
//     "status": "success",
//     "code": 200,
//     "message": "OK",
//     "data": {
//         "all_available": true | false,
//     }
// }
