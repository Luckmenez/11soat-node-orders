import {
  PaymentDtoResponse,
  PaymentGatewayRequest,
} from 'src/application/domain/dto/payment.gateway.interface';

export interface PaymentGatewayPort {
  createPayment(
    paymentData: PaymentGatewayRequest,
  ): Promise<PaymentDtoResponse>;
}
