import { ProductGateway } from '../products.gateway';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { OrderProductDto } from 'src/application/domain/dto/order.product.dto';
import { AxiosResponse } from 'axios';

describe('ProductGateway', () => {
  let gateway: ProductGateway;
  let mockHttpService: jest.Mocked<HttpService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    mockHttpService = {
      post: jest.fn(),
    } as any;

    mockConfigService = {
      get: jest.fn().mockReturnValue('http://products-service:3000'),
    } as any;

    gateway = new ProductGateway(mockHttpService, mockConfigService);
  });

  describe('sendToPreparation', () => {
    it('should send products to preparation successfully', async () => {
      const orderProductDto: OrderProductDto = {
        clientId: 1,
        isRandomClient: false,
        amount: 51.00,
        items: [
          {
            productId: 1,
            title: 'Burger',
            quantity: 2,
            price: 25.50,
            customerItems: [],
          },
        ],
      };

      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await gateway.sendToPreparation(orderProductDto);

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://products-service:3000/validate-products',
        { products: orderProductDto },
      );
    });

    it('should use configured product service URL', async () => {
      const customUrl = 'http://custom-products-url:8080';
      mockConfigService.get.mockReturnValue(customUrl);

      const gateway2 = new ProductGateway(mockHttpService, mockConfigService);

      const orderProductDto: OrderProductDto = {
        clientId: 2,
        isRandomClient: false,
        amount: 100.00,
        items: [],
      };

      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await gateway2.sendToPreparation(orderProductDto);

      expect(mockHttpService.post).toHaveBeenCalledWith(
        `${customUrl}/validate-products`,
        { products: orderProductDto },
      );
    });

    it('should send products with customer items', async () => {
      const orderProductDto: OrderProductDto = {
        clientId: 3,
        isRandomClient: false,
        amount: 40.00,
        items: [
          {
            productId: 5,
            title: 'Pizza',
            quantity: 1,
            price: 35.00,
            customerItems: [
              {
                itemId: 10,
                title: 'Extra Cheese',
                quantity: 1,
                price: 5.00,
              },
            ],
          },
        ],
      };

      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await gateway.sendToPreparation(orderProductDto);

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://products-service:3000/validate-products',
        { products: orderProductDto },
      );
      expect(mockHttpService.post).toHaveBeenCalledTimes(1);
    });

    it('should throw error when HTTP request fails', async () => {
      const orderProductDto: OrderProductDto = {
        clientId: 4,
        isRandomClient: false,
        amount: 0,
        items: [],
      };

      const error = new Error('Network error');
      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(gateway.sendToPreparation(orderProductDto)).rejects.toThrow('Network error');
    });

    it('should get PRODUCT_GATEWAY_URL from config on initialization', () => {
      expect(mockConfigService.get).toHaveBeenCalledWith('PRODUCT_GATEWAY_URL');
    });

    it('should call post method with correct endpoint path', async () => {
      const orderProductDto: OrderProductDto = {
        clientId: 5,
        isRandomClient: false,
        amount: 15.00,
        items: [
          {
            productId: 2,
            title: 'Soda',
            quantity: 3,
            price: 5.00,
            customerItems: [],
          },
        ],
      };

      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await gateway.sendToPreparation(orderProductDto);

      const callArgs = mockHttpService.post.mock.calls[0];
      expect(callArgs[0]).toContain('/validate-products');
    });

    it('should handle empty items array', async () => {
      const orderProductDto: OrderProductDto = {
        clientId: 6,
        isRandomClient: false,
        amount: 0,
        items: [],
      };

      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await gateway.sendToPreparation(orderProductDto);

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://products-service:3000/validate-products',
        { products: orderProductDto },
      );
    });

    it('should return void on success', async () => {
      const orderProductDto: OrderProductDto = {
        clientId: 7,
        isRandomClient: false,
        amount: 50.00,
        items: [],
      };

      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await gateway.sendToPreparation(orderProductDto);

      expect(result).toBeUndefined();
    });

    it('should send payload wrapped in products property', async () => {
      const orderProductDto: OrderProductDto = {
        clientId: 8,
        isRandomClient: false,
        amount: 8.00,
        items: [
          {
            productId: 3,
            title: 'Fries',
            quantity: 1,
            price: 8.00,
            customerItems: [],
          },
        ],
      };

      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await gateway.sendToPreparation(orderProductDto);

      const payload = mockHttpService.post.mock.calls[0][1] as any;
      expect(payload).toHaveProperty('products');
      expect(payload.products).toEqual(orderProductDto);
    });

    it('should handle random client orders', async () => {
      const orderProductDto: OrderProductDto = {
        codeClientRandom: 12345,
        isRandomClient: true,
        amount: 30.00,
        items: [
          {
            productId: 4,
            title: 'Salad',
            quantity: 1,
            price: 30.00,
          },
        ],
      };

      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await gateway.sendToPreparation(orderProductDto);

      expect(mockHttpService.post).toHaveBeenCalled();
    });

    it('should handle orders with observation', async () => {
      const orderProductDto: OrderProductDto = {
        clientId: 9,
        isRandomClient: false,
        amount: 45.00,
        observation: 'No onions',
        items: [
          {
            productId: 1,
            title: 'Burger',
            quantity: 1,
            price: 45.00,
            observation: 'Extra pickles',
          },
        ],
      };

      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await gateway.sendToPreparation(orderProductDto);

      expect(mockHttpService.post).toHaveBeenCalled();
    });
  });
});
