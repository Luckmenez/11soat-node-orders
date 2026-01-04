import { JwtPayload } from '@vineco77/auth-lib';

export interface AuthGatewayPort {
  decodeToken(token: string): Promise<JwtPayload>;
}
