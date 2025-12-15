import { Injectable } from '@nestjs/common';
import { JwtService, JwtPayload } from '@vineco77/auth-lib';
import { AuthGatewayPort } from 'src/application/ports/output/auth.gateway.port';

@Injectable()
export class AuthGateway implements AuthGatewayPort {
  constructor(private readonly jwtService: JwtService) {}
  async decodeToken(token: string): Promise<JwtPayload> {
    const response = this.jwtService.decodeToken(token);
    return response;
  }
}
