import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductGateway } from './products.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: 'ProductGatewayPort',
      useClass: ProductGateway,
    },
  ],
  exports: ['ProductGatewayPort'],
})
export class ProductGatewayModule {}
