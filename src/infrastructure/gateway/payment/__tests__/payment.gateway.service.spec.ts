import { PaymentGatewayService } from '../payment.gateway.service';
import { CreatePaymentGatewayRequest } from 'src/application/domain/dto/payment-create.gateway.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('PaymentGatewayService', () => {
  let service: PaymentGatewayService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockHttpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn().mockReturnValue('http://payment-service:3000'),
    } as any;

    mockHttpService = {
      post: jest.fn().mockImplementation((url, data: any) => {
        const mockPaymentResponse = {
          data: {
            id: data.orderId || 1,
            urlPayment: `https://payment.example.com/pay/${data.orderId || 123}`,
            qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
            qrCodeString: '00020101021226860014br.gov.bcb.pix',
            transactionId: `txn_${data.orderId || 123456}`,
            expirationDate: new Date(Date.now() + 30 * 60 * 1000),
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        };
        return of(mockPaymentResponse);
      }),
      delete: jest.fn().mockReturnValue(of({ data: null, status: 204, statusText: 'No Content', headers: {}, config: {} as any })),
    } as any;

    service = new PaymentGatewayService(mockConfigService, mockHttpService);
  });

  describe('createPayment', () => {
    it('should create payment successfully', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 1,
        amount: 100.5,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should return payment with urlPayment', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 123,
        amount: 250.75,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.urlPayment).toBeDefined();
      expect(typeof result.urlPayment).toBe('string');
      expect(result.urlPayment).toContain('https://');
    });

    it('should return QR code in base64 format', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 456,
        amount: 50.0,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.qrCodeBase64).toBeDefined();
      expect(result.qrCodeBase64).toContain('data:image/png;base64');
    });

    it('should return QR code string', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 789,
        amount: 300.0,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.qrCodeString).toBeDefined();
      expect(typeof result.qrCodeString).toBe('string');
      expect(result.qrCodeString).toContain(
        '00020101021226860014br.gov.bcb.pix',
      );
    });

    it('should return expiration date 30 minutes in the future', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 999,
        amount: 75.25,
        items: [],
      };

      const beforeCall = new Date();
      const result = await service.createPayment(paymentData);
      const afterCall = new Date();

      expect(result.expirationDate).toBeDefined();
      expect(result.expirationDate instanceof Date).toBe(true);

      const expectedMinExpiration = new Date(beforeCall.getTime() + 29 * 60000);
      const expectedMaxExpiration = new Date(afterCall.getTime() + 31 * 60000);

      expect(result.expirationDate.getTime()).toBeGreaterThanOrEqual(
        expectedMinExpiration.getTime(),
      );
      expect(result.expirationDate.getTime()).toBeLessThanOrEqual(
        expectedMaxExpiration.getTime(),
      );
    });

    it('should preserve orderId from request', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 12345,
        amount: 150.0,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.id).toBe(paymentData.orderId);
    });

    it('should handle different amounts', async () => {
      const paymentData1: CreatePaymentGatewayRequest = {
        orderId: 1,
        amount: 10.5,
        items: [],
      };

      const paymentData2: CreatePaymentGatewayRequest = {
        orderId: 2,
        amount: 999.99,
        items: [],
      };

      const result1 = await service.createPayment(paymentData1);
      const result2 = await service.createPayment(paymentData2);

      expect(result1.id).toBe(1);
      expect(result2.id).toBe(2);
    });

    it('should return all required fields in response', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 777,
        amount: 200.0,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('urlPayment');
      expect(result).toHaveProperty('qrCodeBase64');
      expect(result).toHaveProperty('qrCodeString');
      expect(result).toHaveProperty('expirationDate');
    });

    it('should handle multiple sequential calls', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 111,
        amount: 50.0,
        items: [],
      };

      const result1 = await service.createPayment(paymentData);
      const result2 = await service.createPayment(paymentData);

      expect(result1.id).toBe(111);
      expect(result2.id).toBe(111);
      expect(result1.urlPayment).toBeDefined();
      expect(result2.urlPayment).toBeDefined();
    });

    it('should handle payment with items', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 555,
        amount: 100.0,
        items: [
          {
            id: 1,
            title: 'Product 1',
            description: 'Description 1',
            quantity: 2,
            unit_price: 50.0,
            type: 'MAIN',
          },
        ],
      };

      const result = await service.createPayment(paymentData);

      expect(result.id).toBe(555);
      expect(result.urlPayment).toBeDefined();
    });

    it('should handle optional client field', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 666,
        amount: 75.0,
        client: {
          id: 1,
          name: 'Test Client',
          email: 'test@example.com',
          document: '12345678900',
        },
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.id).toBe(666);
    });

    it('should handle optional description field', async () => {
      const paymentData: CreatePaymentGatewayRequest = {
        orderId: 888,
        amount: 125.0,
        description: 'Test payment',
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.id).toBe(888);
    });
  });
});
