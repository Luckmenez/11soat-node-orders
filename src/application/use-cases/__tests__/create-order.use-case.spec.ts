import { CreateOrderUseCase } from '../create-order.use-case';
import { OrderStatus } from '../../value-objects/order-status.enum';
import { OrderFactory } from '../../../../test/utils/factories/order.factory';
import {
  createMockAuthGateway,
  createMockAuthGatewayWithError,
  createMockAuthGatewayWithNoCpf,
} from '../../../../test/utils/mocks/auth-gateway.mock';
import {
  createMockPaymentGateway,
  createMockPaymentGatewayWithError,
} from '../../../../test/utils/mocks/payment-gateway.mock';
import {
  createMockOrderRepository,
  createMockOrderRepositoryWithError,
} from '../../../../test/utils/mocks/order-repository.mock';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let mockAuthGateway: any;
  let mockOrderRepository: any;
  let mockPaymentGateway: any;
  let mockConfigService: any;

  beforeEach(() => {
    mockAuthGateway = createMockAuthGateway();
    mockOrderRepository = createMockOrderRepository();
    mockPaymentGateway = createMockPaymentGateway();
    mockConfigService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    };

    useCase = new CreateOrderUseCase(
      mockConfigService,
      mockAuthGateway,
      mockOrderRepository,
      mockPaymentGateway,
    );
  });

  describe('execute', () => {
    it('should create order and return payment data successfully', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      const result = await useCase.execute(orderData, token);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.urlPayment).toBeDefined();
      expect(result.qrCodeBase64).toBeDefined();
      expect(result.qrCodeString).toBeDefined();
      expect(result.expirationDate).toBeInstanceOf(Date);
    });

    it('should decode token and extract client info', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockAuthGateway.decodeToken).toHaveBeenCalledWith(token);
      expect(mockAuthGateway.decodeToken).toHaveBeenCalledTimes(1);
    });

    it('should create order entity with PENDING status', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: OrderStatus.PENDING,
          amount: orderData.amount,
          items: expect.any(Array),
        }),
      );
    });

    it('should save order entity via repository', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockOrderRepository.save).toHaveBeenCalledTimes(1);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          clientCpf: '12345678900',
          status: OrderStatus.PENDING,
        }),
      );
    });

    it('should create payment with order details', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockPaymentGateway.createPayment).toHaveBeenCalledTimes(1);
      expect(mockPaymentGateway.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 1,
          amount: expect.any(Number),
          client: expect.objectContaining({
            document: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            id: expect.any(Number),
          }),
          callbackUrl: expect.stringContaining('/payments/callback/'),
          items: expect.any(Array),
        }),
      );
    });

    it('should use CPF from token payload', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          clientCpf: '12345678900',
        }),
      );
    });

    it('should set isRandomClient to true when token has sub', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          isRandomClient: true,
        }),
      );
    });

    it('should handle token without CPF', async () => {
      mockAuthGateway = createMockAuthGatewayWithNoCpf();
      useCase = new CreateOrderUseCase(
        mockConfigService,
        mockAuthGateway,
        mockOrderRepository,
        mockPaymentGateway,
      );

      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          clientCpf: null,
        }),
      );
    });

    it('should throw error when auth gateway fails', async () => {
      mockAuthGateway = createMockAuthGatewayWithError();
      useCase = new CreateOrderUseCase(
        mockConfigService,
        mockAuthGateway,
        mockOrderRepository,
        mockPaymentGateway,
      );

      const orderData = OrderFactory.createValidOrderData();
      const token = 'invalid-token';

      await expect(useCase.execute(orderData, token)).rejects.toThrow(
        'Invalid token',
      );
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
      expect(mockPaymentGateway.createPayment).not.toHaveBeenCalled();
    });

    it('should throw error when repository save fails', async () => {
      mockOrderRepository = createMockOrderRepositoryWithError();
      useCase = new CreateOrderUseCase(
        mockConfigService,
        mockAuthGateway,
        mockOrderRepository,
        mockPaymentGateway,
      );

      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await expect(useCase.execute(orderData, token)).rejects.toThrow(
        'Database error',
      );
      expect(mockPaymentGateway.createPayment).not.toHaveBeenCalled();
    });

    it('should throw error when payment gateway fails', async () => {
      mockPaymentGateway = createMockPaymentGatewayWithError();
      useCase = new CreateOrderUseCase(
        mockConfigService,
        mockAuthGateway,
        mockOrderRepository,
        mockPaymentGateway,
      );

      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await expect(useCase.execute(orderData, token)).rejects.toThrow(
        'Payment gateway error',
      );
    });

    it('should throw error when order entity validation fails', async () => {
      const invalidOrderData =
        OrderFactory.createOrderWithInvalidData('emptyItems');
      const token = 'valid-token';

      await expect(useCase.execute(invalidOrderData, token)).rejects.toThrow(
        'Order must contain at least one item',
      );
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
      expect(mockPaymentGateway.createPayment).not.toHaveBeenCalled();
    });

    it('should map order items correctly for payment', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockPaymentGateway.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              title: expect.any(String),
              quantity: expect.any(Number),
              unit_price: expect.any(Number),
            }),
          ]),
        }),
      );
    });

    it('should use client CPF when available', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockPaymentGateway.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.objectContaining({
            document: '12345678900',
          }),
        }),
      );
    });

    it('should include callback URL with order id in payment', async () => {
      const orderData = OrderFactory.createValidOrderData();
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockPaymentGateway.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          callbackUrl: expect.stringMatching(/\/payments\/callback\/\d+/),
        }),
      );
    });

    it('should preserve observation in order entity', async () => {
      const orderData = OrderFactory.createValidOrderData({
        observation: 'Please deliver quickly',
      });
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          observation: 'Please deliver quickly',
        }),
      );
    });

    it('should handle codeClientRandom correctly', async () => {
      const orderData = OrderFactory.createValidOrderData({
        codeClientRandom: 12345,
      });
      const token = 'valid-token';

      await useCase.execute(orderData, token);

      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          codeClientRandom: 12345,
        }),
      );
    });
  });
});
