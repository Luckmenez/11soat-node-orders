import { AuthGateway } from '../auth.gateway';
import { JwtService, JwtPayload } from '@vineco77/auth-lib';

describe('AuthGateway', () => {
  let gateway: AuthGateway;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    mockJwtService = {
      decodeToken: jest.fn(),
    } as any;

    gateway = new AuthGateway(mockJwtService);
  });

  describe('decodeToken', () => {
    it('should decode token successfully', async () => {
      const token = 'valid-token';
      const mockPayload: JwtPayload = {
        id: '123',
        sub: '123',
        cpf: '12345678900',
        user_type: 'cliente',
        name: 'Test User',
        iat: 1234567890,
        exp: 1234567890,
      };

      mockJwtService.decodeToken.mockReturnValue(mockPayload);

      const result = await gateway.decodeToken(token);

      expect(mockJwtService.decodeToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockPayload);
    });

    it('should return payload with all required fields', async () => {
      const token = 'another-valid-token';
      const mockPayload: JwtPayload = {
        id: '456',
        sub: '456',
        cpf: '98765432100',
        user_type: 'funcionario',
        name: 'Admin User',
        iat: 1234567890,
        exp: 1234567890,
      };

      mockJwtService.decodeToken.mockReturnValue(mockPayload);

      const result = await gateway.decodeToken(token);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('cpf');
      expect(result).toHaveProperty('user_type');
      expect(result.id).toBe('456');
      expect(result.cpf).toBe('98765432100');
    });

    it('should pass through the token to jwtService', async () => {
      const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const mockPayload: JwtPayload = {
        id: '789',
        sub: '789',
        cpf: '11122233344',
        user_type: 'cliente',
        name: 'Customer',
        iat: 1234567890,
        exp: 1234567890,
      };

      mockJwtService.decodeToken.mockReturnValue(mockPayload);

      await gateway.decodeToken(token);

      expect(mockJwtService.decodeToken).toHaveBeenCalledTimes(1);
      expect(mockJwtService.decodeToken).toHaveBeenCalledWith(token);
    });

    it('should throw error when jwtService fails', async () => {
      const token = 'invalid-token';
      const error = new Error('Invalid token');

      mockJwtService.decodeToken.mockImplementation(() => {
        throw error;
      });

      await expect(gateway.decodeToken(token)).rejects.toThrow('Invalid token');
    });

    it('should handle different user types', async () => {
      const token = 'token-for-admin';
      const funcionarioPayload: JwtPayload = {
        id: '999',
        sub: '999',
        cpf: '55566677788',
        user_type: 'funcionario',
        name: 'System Admin',
        iat: 1234567890,
        exp: 1234567890,
      };

      mockJwtService.decodeToken.mockReturnValue(funcionarioPayload);

      const result = await gateway.decodeToken(token);

      expect(result.user_type).toBe('funcionario');
    });
  });
});
