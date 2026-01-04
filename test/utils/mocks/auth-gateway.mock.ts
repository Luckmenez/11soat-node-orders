import { AuthGatewayPort } from '../../../src/application/ports/output/auth.gateway.port';
import { JwtPayload } from '@vineco77/auth-lib';

export class MockAuthGateway implements AuthGatewayPort {
  async decodeToken(token: string): Promise<JwtPayload> {
    if (token === 'invalid-token') {
      throw new Error('Invalid token');
    }

    return {
      sub: '123',
      cpf: '12345678900',
      user_type: 'cliente',
      name: 'Test User',
    };
  }
}

export const createMockAuthGateway = () => {
  return {
    decodeToken: jest.fn().mockResolvedValue({
      sub: '123',
      cpf: '12345678900',
      user_type: 'cliente',
      name: 'Test User',
    }),
  };
};

export const createMockAuthGatewayWithError = () => {
  return {
    decodeToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
  };
};

export const createMockAuthGatewayWithNoCpf = () => {
  return {
    decodeToken: jest.fn().mockResolvedValue({
      sub: '123',
      cpf: null,
      user_type: 'cliente',
      name: 'Test User',
    }),
  };
};
