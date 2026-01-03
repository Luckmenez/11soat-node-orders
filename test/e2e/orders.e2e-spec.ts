import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { OrderStatus } from '../../src/application/value-objects/order-status.enum';
import { PrismaService } from '../../src/infrastructure/persistence/prisma.service';

describe('Orders E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Aplicar ValidationPipe global (como em produção)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // Limpar banco após cada teste
    await prisma.orderItemCustomization.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /orders/create-order', () => {
    const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';

    it('should create order successfully with valid data', async () => {
      const orderData = {
        clientCpf: '12345678900',
        amount: 100.50,
        observation: 'No onions',
        items: [
          {
            productId: 1,
            title: 'Burger',
            description: 'Delicious burger',
            photo: 'burger.jpg',
            quantity: 2,
            price: 50.25,
            unitPrice: 50.25,
            type: 'MAIN',
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/orders/create-order')
        .set('Authorization', validToken)
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('orderId');
      expect(response.body).toHaveProperty('urlPayment');
      expect(response.body).toHaveProperty('qrCodeBase64');
      expect(response.body).toHaveProperty('qrCodeString');
      expect(response.body).toHaveProperty('expirationDate');
      expect(typeof response.body.orderId).toBe('number');
      expect(response.body.orderId).toBeGreaterThan(0);
    });

    it('should create order with customer customizations', async () => {
      const orderData = {
        clientCpf: '98765432100',
        amount: 55.50,
        items: [
          {
            productId: 1,
            title: 'Pizza',
            description: 'Pepperoni',
            photo: 'pizza.jpg',
            quantity: 1,
            price: 50.00,
            unitPrice: 50.00,
            type: 'MAIN',
            customerItems: [
              {
                itemId: 10,
                title: 'Extra Cheese',
                description: 'More cheese',
                quantity: 1,
                price: 5.50,
                unitPrice: 5.50,
                type: 'EXTRA',
              },
            ],
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/orders/create-order')
        .set('Authorization', validToken)
        .send(orderData)
        .expect(201);

      expect(response.body.orderId).toBeDefined();

      // Verificar no banco
      const order = await prisma.order.findUnique({
        where: { id: response.body.orderId },
        include: {
          items: {
            include: { customerItems: true },
          },
        },
      });

      expect(order!.items[0].customerItems).toHaveLength(1);
    });

    it('should create order for random client', async () => {
      const orderData = {
        isRandomClient: true,
        codeClientRandom: 12345,
        amount: 75.00,
        items: [
          {
            productId: 2,
            title: 'Soda',
            description: 'Coca-Cola',
            quantity: 3,
            price: 25.00,
            unitPrice: 25.00,
            type: 'DRINK',
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/orders/create-order')
        .set('Authorization', validToken)
        .send(orderData)
        .expect(201);

      const order = await prisma.order.findUnique({
        where: { id: response.body.orderId },
      });

      expect(order!.isRandomClient).toBe(true);
      expect(order!.codeClientRandom).toBe(12345);
    });

    it('should return 401 without authorization header', async () => {
      const orderData = {
        clientCpf: '12345678900',
        amount: 100.00,
        items: [
          {
            productId: 1,
            title: 'Burger',
            quantity: 1,
            price: 100.00,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/orders/create-order')
        .send(orderData)
        .expect(401);
    });

    it('should return 400 for empty items', async () => {
      const orderData = {
        clientCpf: '12345678900',
        amount: 0,
        items: [],
      };

      await request(app.getHttpServer())
        .post('/orders/create-order')
        .set('Authorization', validToken)
        .send(orderData)
        .expect(400);
    });

    it('should return 400 for invalid item quantity', async () => {
      const orderData = {
        clientCpf: '12345678900',
        amount: 50.00,
        items: [
          {
            productId: 1,
            title: 'Burger',
            quantity: -1, // Invalid
            price: 50.00,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/orders/create-order')
        .set('Authorization', validToken)
        .send(orderData)
        .expect(400);
    });
  });

  describe('GET /orders/get-paginated/:page/:limit', () => {
    beforeEach(async () => {
      // Criar 15 orders para testar paginação
      for (let i = 0; i < 15; i++) {
        await prisma.order.create({
          data: {
            clientCpf: `1234567890${i}`,
            status: OrderStatus.PENDING,
            amount: 50 + i,
            isRandomClient: false,
            items: {
              create: [
                {
                  productId: 1,
                  title: `Product ${i}`,
                  description: 'Description',
                  photo: 'photo.jpg',
                  quantity: 1,
                  price: 50 + i,
                  unitPrice: 50 + i,
                  type: 'MAIN',
                  customerItems: { create: [] },
                },
              ],
            },
          },
        });
      }
    });

    it('should return first page of orders', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/get-paginated/1/10')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(10);
      expect(response.body.total).toBe(15);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
    });

    it('should return second page of orders', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/get-paginated/2/10')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.total).toBe(15);
      expect(response.body.page).toBe(2);
    });

    it('should return empty page when beyond data', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/get-paginated/3/10')
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.total).toBe(15);
      expect(response.body.page).toBe(3);
    });

    it('should handle different page sizes', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/get-paginated/1/5')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.limit).toBe(5);
    });

    it('should return all items with correct structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/get-paginated/1/10')
        .expect(200);

      const firstOrder = response.body.data[0];
      expect(firstOrder).toHaveProperty('id');
      expect(firstOrder).toHaveProperty('clientCpf');
      expect(firstOrder).toHaveProperty('status');
      expect(firstOrder).toHaveProperty('amount');
      expect(firstOrder).toHaveProperty('items');
      expect(Array.isArray(firstOrder.items)).toBe(true);
    });
  });

  describe('PATCH /orders/update-order-payment/:orderId', () => {
    let createdOrderId: number;

    beforeEach(async () => {
      // Criar order para atualizar
      const order = await prisma.order.create({
        data: {
          clientCpf: '11122233344',
          status: OrderStatus.PENDING,
          amount: 100.00,
          isRandomClient: false,
          items: {
            create: [
              {
                productId: 1,
                title: 'Burger',
                description: 'Test',
                photo: 'test.jpg',
                quantity: 1,
                price: 100.00,
                unitPrice: 100.00,
                type: 'MAIN',
                customerItems: { create: [] },
              },
            ],
          },
        },
      });

      createdOrderId = order.id;
    });

    it('should update order payment status successfully', async () => {
      const updateData = {
        status: OrderStatus.PAID,
        transactionId: 'TXN-E2E-123',
      };

      await request(app.getHttpServer())
        .patch(`/orders/update-order-payment/${createdOrderId}`)
        .send(updateData)
        .expect(200);

      // Verificar no banco
      const updatedOrder = await prisma.order.findUnique({
        where: { id: createdOrderId },
      });

      expect(updatedOrder!.status).toBe(OrderStatus.PAID);
      expect(updatedOrder!.transactionId).toBe('TXN-E2E-123');
    });

    it('should return 404 for non-existent order', async () => {
      const updateData = {
        status: OrderStatus.PAID,
        transactionId: 'TXN-999',
      };

      const response = await request(app.getHttpServer())
        .patch('/orders/update-order-payment/999999')
        .send(updateData)
        .expect(404);

      expect(response.body.message).toContain('Order not found');
    });

    it('should accept different order statuses', async () => {
      const statuses = [
        OrderStatus.PAID,
        OrderStatus.PREPARING,
        OrderStatus.READY,
        OrderStatus.COMPLETED,
      ];

      for (const status of statuses) {
        // Criar nova order para cada status
        const order = await prisma.order.create({
          data: {
            clientCpf: '99988877766',
            status: OrderStatus.PENDING,
            amount: 50.00,
            isRandomClient: false,
            items: { create: [] },
          },
        });

        await request(app.getHttpServer())
          .patch(`/orders/update-order-payment/${order.id}`)
          .send({
            status,
            transactionId: `TXN-${status}`,
          })
          .expect(200);

        const updated = await prisma.order.findUnique({
          where: { id: order.id },
        });

        expect(updated!.status).toBe(status);
      }
    });

    it('should return 400 for invalid order ID format', async () => {
      await request(app.getHttpServer())
        .patch('/orders/update-order-payment/abc')
        .send({
          status: OrderStatus.PAID,
          transactionId: 'TXN-ABC',
        })
        .expect(400);
    });
  });

  describe('Complete Order Flow (E2E)', () => {
    const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';

    it('should complete full order lifecycle', async () => {
      // 1. Create order
      const createResponse = await request(app.getHttpServer())
        .post('/orders/create-order')
        .set('Authorization', validToken)
        .send({
          clientCpf: '55566677788',
          amount: 125.50,
          observation: 'E2E test order',
          items: [
            {
              productId: 1,
              title: 'Combo Meal',
              description: 'Burger + Fries + Soda',
              photo: 'combo.jpg',
              quantity: 1,
              price: 100.00,
              unitPrice: 100.00,
              type: 'MAIN',
              customerItems: [
                {
                  itemId: 10,
                  title: 'Extra Bacon',
                  description: 'Double bacon',
                  quantity: 1,
                  price: 25.50,
                  unitPrice: 25.50,
                  type: 'EXTRA',
                },
              ],
            },
          ],
        })
        .expect(201);

      const orderId = createResponse.body.orderId;
      expect(orderId).toBeDefined();
      expect(createResponse.body.urlPayment).toBeDefined();

      // 2. List orders and verify it exists
      const listResponse = await request(app.getHttpServer())
        .get('/orders/get-paginated/1/10')
        .expect(200);

      const orderInList = listResponse.body.data.find(
        (order: any) => order.id === orderId,
      );
      expect(orderInList).toBeDefined();
      expect(orderInList.status).toBe(OrderStatus.PENDING);
      expect(orderInList.clientCpf).toBe('55566677788');

      // 3. Update payment to PAID
      await request(app.getHttpServer())
        .patch(`/orders/update-order-payment/${orderId}`)
        .send({
          status: OrderStatus.PAID,
          transactionId: 'TXN-E2E-FLOW-123',
        })
        .expect(200);

      // 4. Verify status updated in list
      const listAfterPaid = await request(app.getHttpServer())
        .get('/orders/get-paginated/1/10')
        .expect(200);

      const paidOrder = listAfterPaid.body.data.find(
        (order: any) => order.id === orderId,
      );
      expect(paidOrder.status).toBe(OrderStatus.PAID);
      expect(paidOrder.transactionId).toBe('TXN-E2E-FLOW-123');

      // 5. Update to PREPARING
      await request(app.getHttpServer())
        .patch(`/orders/update-order-payment/${orderId}`)
        .send({
          status: OrderStatus.PREPARING,
          transactionId: 'TXN-E2E-FLOW-123',
        })
        .expect(200);

      // 6. Update to READY
      await request(app.getHttpServer())
        .patch(`/orders/update-order-payment/${orderId}`)
        .send({
          status: OrderStatus.READY,
          transactionId: 'TXN-E2E-FLOW-123',
        })
        .expect(200);

      // 7. Final verification
      const finalOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: { customerItems: true },
          },
        },
      });

      expect(finalOrder).toBeDefined();
      expect(finalOrder!.status).toBe(OrderStatus.READY);
      expect(finalOrder!.items).toHaveLength(1);
      expect(finalOrder!.items[0].customerItems).toHaveLength(1);
      expect(finalOrder!.observation).toBe('E2E test order');
    });

    it('should handle multiple orders concurrently', async () => {
      // Criar 5 orders simultaneamente
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          request(app.getHttpServer())
            .post('/orders/create-order')
            .set('Authorization', validToken)
            .send({
              clientCpf: `44455566${i}77`,
              amount: 50 + i,
              items: [
                {
                  productId: i + 1,
                  title: `Product ${i}`,
                  quantity: 1,
                  price: 50 + i,
                },
              ],
            }),
        );
      }

      const responses = await Promise.all(promises);

      // Verificar que todos foram criados
      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body.orderId).toBeDefined();
      });

      // Verificar no banco
      const orders = await prisma.order.findMany();
      expect(orders.length).toBe(5);
    });
  });
});
