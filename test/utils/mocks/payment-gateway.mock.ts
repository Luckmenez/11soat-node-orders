import { PaymentGatewayPort } from '../../../src/application/ports/output/payment.gateway.port';
import {
  PaymentDtoResponse,
  PaymentGatewayRequest,
} from '../../../src/application/domain/dto/payment.gateway.interface';

export const createMockPaymentGateway = (): jest.Mocked<PaymentGatewayPort> => {
  return {
    createPayment: jest.fn().mockResolvedValue({
      orderId: 1,
      urlPayment: 'https://payment-gateway.com/pay/123456',
      qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
      qrCodeString: '00020101021226860014br.gov.bcb.pix0136...',
      expirationDate: new Date(Date.now() + 30 * 60000),
    } as PaymentDtoResponse),
  };
};

export const createMockPaymentGatewayWithError = (): jest.Mocked<PaymentGatewayPort> => {
  return {
    createPayment: jest.fn().mockRejectedValue(new Error('Payment gateway error')),
  };
};

export const createMockPaymentGatewayWithCustomResponse = (
  response: PaymentDtoResponse,
): jest.Mocked<PaymentGatewayPort> => {
  return {
    createPayment: jest.fn().mockResolvedValue(response),
  };
};
