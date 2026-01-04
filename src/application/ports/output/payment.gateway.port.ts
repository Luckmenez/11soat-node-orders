import {
  PaymentDtoResponse,
  CreatePaymentGatewayRequest,
} from 'src/application/domain/dto/payment-create.gateway.interface';
import { PaymentDeleteGatewayRequest } from 'src/application/domain/dto/payment-delete.gateway.interface';

export interface PaymentGatewayPort {
  createPayment(
    paymentData: CreatePaymentGatewayRequest,
  ): Promise<PaymentDtoResponse>;
  cancelPayment(transactionId: PaymentDeleteGatewayRequest): Promise<void>;
}
