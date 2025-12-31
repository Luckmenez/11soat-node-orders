import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment.gateway.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'PaymentGatewayPort',
      useClass: PaymentGatewayService,
    },
  ],
  exports: ['PaymentGatewayPort'],
})
export class PaymentGatewayModule {}
