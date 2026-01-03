import { PaymentGatewayService } from '../payment.gateway.service';
import { PaymentGatewayRequest } from 'src/application/domain/dto/payment.gateway.interface';

describe('PaymentGatewayService', () => {
  let service: PaymentGatewayService;

  beforeEach(() => {
    service = new PaymentGatewayService();
  });

  describe('createPayment', () => {
    it('should create payment successfully', async () => {
      const paymentData: PaymentGatewayRequest = {
        orderId: 1,
        amount: 100.50,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result).toBeDefined();
      expect(result.orderId).toBe(1);
    });

    it('should return payment with urlPayment', async () => {
      const paymentData: PaymentGatewayRequest = {
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
      const paymentData: PaymentGatewayRequest = {
        orderId: 456,
        amount: 50.00,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.qrCodeBase64).toBeDefined();
      expect(result.qrCodeBase64).toContain('data:image/png;base64');
    });

    it('should return QR code string', async () => {
      const paymentData: PaymentGatewayRequest = {
        orderId: 789,
        amount: 300.00,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.qrCodeString).toBeDefined();
      expect(typeof result.qrCodeString).toBe('string');
      expect(result.qrCodeString).toContain('00020101021226860014br.gov.bcb.pix');
    });

    it('should return expiration date 30 minutes in the future', async () => {
      const paymentData: PaymentGatewayRequest = {
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

      expect(result.expirationDate.getTime()).toBeGreaterThanOrEqual(expectedMinExpiration.getTime());
      expect(result.expirationDate.getTime()).toBeLessThanOrEqual(expectedMaxExpiration.getTime());
    });

    it('should preserve orderId from request', async () => {
      const paymentData: PaymentGatewayRequest = {
        orderId: 12345,
        amount: 150.00,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.orderId).toBe(paymentData.orderId);
    });

    it('should handle different amounts', async () => {
      const paymentData1: PaymentGatewayRequest = {
        orderId: 1,
        amount: 10.50,
        items: [],
      };

      const paymentData2: PaymentGatewayRequest = {
        orderId: 2,
        amount: 999.99,
        items: [],
      };

      const result1 = await service.createPayment(paymentData1);
      const result2 = await service.createPayment(paymentData2);

      expect(result1.orderId).toBe(1);
      expect(result2.orderId).toBe(2);
    });

    it('should return all required fields in response', async () => {
      const paymentData: PaymentGatewayRequest = {
        orderId: 777,
        amount: 200.00,
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result).toHaveProperty('orderId');
      expect(result).toHaveProperty('urlPayment');
      expect(result).toHaveProperty('qrCodeBase64');
      expect(result).toHaveProperty('qrCodeString');
      expect(result).toHaveProperty('expirationDate');
    });

    it('should handle multiple sequential calls', async () => {
      const paymentData: PaymentGatewayRequest = {
        orderId: 111,
        amount: 50.00,
        items: [],
      };

      const result1 = await service.createPayment(paymentData);
      const result2 = await service.createPayment(paymentData);

      expect(result1.orderId).toBe(111);
      expect(result2.orderId).toBe(111);
      expect(result1.urlPayment).toBeDefined();
      expect(result2.urlPayment).toBeDefined();
    });

    it('should handle payment with items', async () => {
      const paymentData: PaymentGatewayRequest = {
        orderId: 555,
        amount: 100.00,
        items: [
          {
            id: 1,
            title: 'Product 1',
            description: 'Description 1',
            quantity: 2,
            unit_price: 50.00,
            type: 'MAIN',
          },
        ],
      };

      const result = await service.createPayment(paymentData);

      expect(result.orderId).toBe(555);
      expect(result.urlPayment).toBeDefined();
    });

    it('should handle optional client field', async () => {
      const paymentData: PaymentGatewayRequest = {
        orderId: 666,
        amount: 75.00,
        client: '12345678900',
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.orderId).toBe(666);
    });

    it('should handle optional description field', async () => {
      const paymentData: PaymentGatewayRequest = {
        orderId: 888,
        amount: 125.00,
        description: 'Test payment',
        items: [],
      };

      const result = await service.createPayment(paymentData);

      expect(result.orderId).toBe(888);
    });
  });
});
