import { OrderStatus } from 'src/application/value-objects/order-status.enum';

export interface CreateOrderItemCustomerDto {
  itemId?: number;
  title: string;
  description?: string | null;
  photo?: string | null;
  quantity: number;
  price: any;
  unitPrice?: any;
  observation?: string | null;
  type: string;
}

export interface CreateOrderItemDto {
  productId: number;
  title: string;
  description?: string | null;
  photo?: string | null;
  quantity: number;
  price: any;
  unitPrice?: any;
  observation?: string | null;
  customerItems?: CreateOrderItemCustomerDto[];
  type: string;
}

export interface CreateOrderDto {
  clientId?: number;
  status: OrderStatus;
  amount: any;
  items: CreateOrderItemDto[];
  isRandomClient?: boolean;
  codeClientRandom?: number;
  observation?: string | null;
  transactionId: string;
}
