import { GetOrdersPaginatedUseCase } from '../get-orders-paginated.use-cases';
import { createMockOrderRepository } from '../../../../test/utils/mocks/order-repository.mock';

describe('GetOrdersPaginatedUseCase', () => {
  let useCase: GetOrdersPaginatedUseCase;
  let mockOrderRepository: any;

  beforeEach(() => {
    mockOrderRepository = createMockOrderRepository();
    useCase = new GetOrdersPaginatedUseCase(mockOrderRepository);
  });

  describe('execute', () => {
    it('should get paginated orders successfully', async () => {
      const result = await useCase.execute({ page: 1, limit: 10 });

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should call repository with correct parameters', async () => {
      await useCase.execute({ page: 2, limit: 20 });

      expect(mockOrderRepository.getPaginatedOrders).toHaveBeenCalledWith(2, 20);
      expect(mockOrderRepository.getPaginatedOrders).toHaveBeenCalledTimes(1);
    });

    it('should return paginated result structure', async () => {
      const result = await useCase.execute({ page: 1, limit: 10 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
    });

    it('should handle different page numbers', async () => {
      await useCase.execute({ page: 5, limit: 10 });

      expect(mockOrderRepository.getPaginatedOrders).toHaveBeenCalledWith(5, 10);
    });

    it('should handle different limit values', async () => {
      await useCase.execute({ page: 1, limit: 50 });

      expect(mockOrderRepository.getPaginatedOrders).toHaveBeenCalledWith(1, 50);
    });

    it('should return empty data array when no orders exist', async () => {
      mockOrderRepository.getPaginatedOrders.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      const result = await useCase.execute({ page: 1, limit: 10 });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle large page numbers', async () => {
      mockOrderRepository.getPaginatedOrders.mockResolvedValue({
        data: [],
        total: 100,
        page: 20,
        limit: 10,
      });

      const result = await useCase.execute({ page: 20, limit: 10 });

      expect(result.page).toBe(20);
      expect(result.data).toEqual([]);
    });
  });
});
