import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from 'src/application/controller/orders.controller';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import configuration from './infrastructure/configuration/configuration';
import { validationSchema } from 'src/infrastructure/configuration/validation.schema';
import { AuthGatewayModule } from './infrastructure/gateway/auth/auth.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { PaymentGatewayModule } from './infrastructure/gateway/payment/payment.module';
import { GetOrdersPaginatedUseCase } from './application/use-cases/get-orders-paginated.use-cases';
import { UpdateOrderPaymentUseCase } from './application/use-cases/update-order-payment.use-case';
import { ProductGatewayModule } from './infrastructure/gateway/products/products.gateway.module';
import { DeleteOrderUseCase } from './application/use-cases/delete-order.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      ignoreEnvFile: ['production', 'staging'].includes(process.env.NODE_ENV),
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    PersistenceModule,
    AuthGatewayModule,
    PaymentGatewayModule,
    ProductGatewayModule,
  ],
  controllers: [OrdersController],
  providers: [
    {
      provide: 'CreateOrderUseCasePort',
      useClass: CreateOrderUseCase,
    },
    {
      provide: 'GetOrdersPaginatedUseCasePort',
      useClass: GetOrdersPaginatedUseCase,
    },
    {
      provide: 'UpdateOrderPaymentUseCasePort',
      useClass: UpdateOrderPaymentUseCase,
    },
    {
      provide: 'DeleteOrderUseCasePort',
      useClass: DeleteOrderUseCase,
    },
  ],
})
export class AppModule {}
