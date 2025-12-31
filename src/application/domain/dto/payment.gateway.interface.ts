export interface CreatePaymentDto {
  amount: number;
  description: string;
  orderId?: number | null;
  callbackUrl?: string;
  expirationMinutes?: number;
}

export interface PaymentDtoResponse {
  orderId: number;
  qrCodeBase64?: string;
  qrCodeString?: string;
  urlPayment: string;
  expirationDate?: Date;
}

export interface PaymentDataItem {
  id: string;
  title: string | null;
  description: string;
  picture_url: string;
  category_id: string;
  quantity: number;
  unit_price: any;
  type: string;
  event_date: string;
  warranty: boolean;
}

export interface PaymentGatewayRequest {
  amount: number;
  description?: string;
  client?: string;
  orderId: number;
  callbackUrl?: string;
  items: {
    id: number;
    title: string;
    description: string;
    quantity: number;
    unit_price: number;
    type: string;
  }[];
}
