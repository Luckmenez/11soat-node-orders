import { ProductGatewayPort } from '../../../src/application/ports/output/product.gateway.port';
import { OrderProductDto } from '../../../src/application/domain/dto/order.product.dto';

export const createMockProductGateway = (): jest.Mocked<ProductGatewayPort> => {
  return {
    sendToPreparation: jest.fn().mockResolvedValue(undefined),
  };
};

export const createMockProductGatewayWithError = (): jest.Mocked<ProductGatewayPort> => {
  return {
    sendToPreparation: jest.fn().mockRejectedValue(new Error('Product gateway unavailable')),
  };
};
