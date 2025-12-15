import { Module } from '@nestjs/common';
import { AuthGateway } from './auth.gateway';
import { JwtService } from '@vineco77/auth-lib';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [
    {
      provide: JwtService,
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return new JwtService(secret);
      },
      inject: [ConfigService],
    },
    {
      provide: 'AuthGatewayPort',
      useClass: AuthGateway,
    },
  ],
  exports: ['AuthGatewayPort'],
})
export class AuthGatewayModule {}
