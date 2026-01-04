export interface OrderProductCustomerItemDto {
  itemId?: number;
  title: string;
  quantity: number;
  price: number;
  observation?: string | null;
}

export interface OrderProductItemDto {
  productId: number;
  title: string;
  quantity: number;
  price: number;
  observation?: string | null;
  customerItems?: OrderProductCustomerItemDto[];
}

export interface OrderProductDto {
  clientId?: number;
  codeClientRandom?: number;
  isRandomClient: boolean;
  amount: number;
  observation?: string | null;
  transactionId?: string | null;
  items: OrderProductItemDto[];
}
