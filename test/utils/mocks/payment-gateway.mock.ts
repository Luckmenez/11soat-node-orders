import { PaymentGatewayPort } from '../../../src/application/ports/output/payment.gateway.port';
import { PaymentDtoResponse } from '../../../src/application/domain/dto/payment-create.gateway.interface';

export const createMockPaymentGateway = (): jest.Mocked<PaymentGatewayPort> => {
  return {
    createPayment: jest.fn().mockResolvedValue({
      id: 1,
      transactionId: 'tx123456',
      status: 'PAID',
      amount: 100,
      urlPayment: 'https://payment-gateway.com/pay/123456',
      qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
      qrCodeString: '00020101021226860014br.gov.bcb.pix0136...',
      expirationDate: new Date(Date.now() + 30 * 60000),
    } as PaymentDtoResponse),
    cancelPayment: jest.fn().mockResolvedValue(undefined),
  };
};

export const createMockPaymentGatewayWithError =
  (): jest.Mocked<PaymentGatewayPort> => {
    return {
      createPayment: jest
        .fn()
        .mockRejectedValue(new Error('Payment gateway error')),
      cancelPayment: jest
        .fn()
        .mockRejectedValue(new Error('Payment gateway error')),
    };
  };

export const createMockPaymentGatewayWithCustomResponse = (
  response: PaymentDtoResponse,
): jest.Mocked<PaymentGatewayPort> => {
  return {
    createPayment: jest.fn().mockResolvedValue(response),
    cancelPayment: jest.fn().mockResolvedValue(undefined),
  };
};
