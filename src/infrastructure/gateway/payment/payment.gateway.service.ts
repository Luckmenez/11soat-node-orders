import { Injectable } from '@nestjs/common';
import {
  PaymentDtoResponse,
  PaymentGatewayRequest,
} from 'src/application/domain/dto/payment.gateway.interface';
import { PaymentGatewayPort } from 'src/application/ports/output/payment.gateway.port';

@Injectable()
export class PaymentGatewayService implements PaymentGatewayPort {
  constructor() {}

  //mock
  async createPayment(
    paymentData: PaymentGatewayRequest,
  ): Promise<PaymentDtoResponse> {
    setTimeout(() => {}, 1000);

    return {
      orderId: paymentData.orderId,
      urlPayment: 'https://payment-gateway.com/pay/123456',
      qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
      qrCodeString: '00020101021226860014br.gov.bcb.pix0136...',
      expirationDate: new Date(Date.now() + 30 * 60000),
    };
  }
}
