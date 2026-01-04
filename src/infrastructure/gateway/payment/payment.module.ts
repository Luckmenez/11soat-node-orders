import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentGatewayService } from './payment.gateway.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'PaymentGatewayPort',
      useClass: PaymentGatewayService,
    },
  ],
  exports: ['PaymentGatewayPort'],
})
export class PaymentGatewayModule {}
