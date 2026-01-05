import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
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

  async createPayment(
    paymentData: CreatePaymentGatewayRequest,
  ): Promise<PaymentDtoResponse> {
    const { data } = await firstValueFrom(
      this.httpService.post<PaymentDtoResponse>(
        `${this.paymentServiceUrl}/payment/create`,
        {
          ...paymentData,
        },
      ),
    ).catch((error) => {
      console.error(
        'Error creating payment in gateway:',
        error.response?.data || error.message,
      );
      throw error;
    });

    console.log(data);

    return data;
  }

  async cancelPayment({
    transactionId,
  }: PaymentDeleteGatewayRequest): Promise<void> {
    await firstValueFrom(
      this.httpService.delete<void>(
        `${this.paymentServiceUrl}/payment/cancel/${transactionId}`,
      ),
    );
  }
}
