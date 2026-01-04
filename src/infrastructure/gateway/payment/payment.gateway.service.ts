import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { firstValueFrom } from 'rxjs';
import {
  PaymentDtoResponse,
  CreatePaymentGatewayRequest,
} from 'src/application/domain/dto/payment-create.gateway.interface';
import { PaymentDeleteGatewayRequest } from 'src/application/domain/dto/payment-delete.gateway.interface';
import { PaymentGatewayPort } from 'src/application/ports/output/payment.gateway.port';

@Injectable()
export class PaymentGatewayService implements PaymentGatewayPort {
  private readonly paymentServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.paymentServiceUrl = this.configService.get<string>(
      'PAYMENT_GATEWAY_URL',
    );
  }

  //mock
  async createPayment(
    paymentData: CreatePaymentGatewayRequest,
  ): Promise<PaymentDtoResponse> {
    setTimeout(() => {}, 1000);

    // await firstValueFrom(
    //   this.httpService.post<void>(
    //     `${this.paymentServiceUrl}/payments/create`,
    //     { paymentData },
    //   ),
    // );

    console.log('Creating payment with data:', paymentData);

    return {
      id: paymentData.orderId,
      transactionId: 'tx123456789',
      status: 'PAID',
      amount: paymentData.amount,
      urlPayment: `https://payment-gateway.com/orders/update-order-payment/${paymentData.orderId}`,
      qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
      qrCodeString: '00020101021226860014br.gov.bcb.pix0136...',
      expirationDate: new Date(Date.now() + 30 * 60000),
    };
  }

  async cancelPayment({
    transactionId,
  }: PaymentDeleteGatewayRequest): Promise<void> {
    setTimeout(() => {}, 500);

    // await firstValueFrom(
    //   this.httpService.delete<void>(
    //     `${this.paymentServiceUrl}/payments/cancel/${transactionId}`,
    //   ),
    // );

    console.log(
      `Payment with transaction ID ${transactionId} has been canceled.`,
    );
  }
}
