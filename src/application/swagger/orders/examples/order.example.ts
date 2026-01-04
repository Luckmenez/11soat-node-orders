import { OrderStatus } from 'src/application/value-objects/order-status.enum';

export const createOrderExample = {
  clientId: 1,
  status: OrderStatus.PENDING,
  amount: 59.90,
  items: [
    {
      productId: 1,
      title: 'X-Burger',
      description: 'Hambúrguer artesanal com queijo cheddar',
      photo: 'https://example.com/xburger.jpg',
      quantity: 2,
      price: 25.90,
      unitPrice: 25.90,
      observation: 'Sem cebola',
      type: 'LANCHE',
      customerItems: [
        {
          itemId: 1,
          title: 'Queijo Extra',
          description: 'Adicional de queijo cheddar',
          photo: null,
          quantity: 1,
          price: 3.00,
          unitPrice: 3.00,
          observation: null,
          type: 'ADICIONAL',
        },
      ],
    },
    {
      productId: 2,
      title: 'Refrigerante Lata',
      description: 'Refrigerante 350ml',
      photo: 'https://example.com/refrigerante.jpg',
      quantity: 1,
      price: 5.00,
      unitPrice: 5.00,
      observation: null,
      type: 'BEBIDA',
      customerItems: [],
    },
  ],
  isRandomClient: false,
  observation: 'Entrega rápida',
  transactionId: 'txn_123456789',
};

export const createOrderRandomClientExample = {
  status: OrderStatus.PENDING,
  amount: 35.90,
  items: [
    {
      productId: 3,
      title: 'Hot Dog',
      description: 'Hot dog completo',
      photo: 'https://example.com/hotdog.jpg',
      quantity: 1,
      price: 15.90,
      unitPrice: 15.90,
      observation: 'Com tudo',
      type: 'LANCHE',
      customerItems: [],
    },
  ],
  isRandomClient: true,
  codeClientRandom: 1234,
  observation: null,
  transactionId: 'txn_987654321',
};

export const updateOrderPaymentExample = {
  orderId: 1,
  status: OrderStatus.PAID,
  transactionId: 'txn_123456789',
  amount: 59.90,
};

export const updateOrderPaymentFailedExample = {
  orderId: 1,
  status: OrderStatus.FAILED,
  transactionId: 'txn_123456789',
  amount: 59.90,
};

export const orderResponseExample = {
  id: 1,
  clientId: 1,
  status: OrderStatus.PENDING,
  amount: 59.90,
  items: [
    {
      id: 1,
      productId: 1,
      title: 'X-Burger',
      description: 'Hambúrguer artesanal com queijo cheddar',
      photo: 'https://example.com/xburger.jpg',
      quantity: 2,
      price: 25.90,
      unitPrice: 25.90,
      observation: 'Sem cebola',
      type: 'LANCHE',
    },
  ],
  isRandomClient: false,
  codeClientRandom: null,
  observation: 'Entrega rápida',
  transactionId: 'txn_123456789',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

export const paginatedOrdersResponseExample = {
  data: [
    {
      id: 1,
      clientId: 1,
      status: OrderStatus.PENDING,
      amount: 59.90,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      clientId: 2,
      status: OrderStatus.PAID,
      amount: 35.90,
      createdAt: '2024-01-15T11:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z',
    },
  ],
  meta: {
    total: 50,
    page: 1,
    limit: 10,
    totalPages: 5,
  },
};
