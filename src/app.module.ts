import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from 'src/application/controller/orders.controller';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { ProductGatewayModule } from './infrastructure/gateway/products/products.gateway.module';
import configuration from './infrastructure/configuration/configuration';
import { validationSchema } from 'src/infrastructure/configuration/validation.schema';
import { AuthGatewayModule } from './infrastructure/gateway/auth/auth.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

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
    ProductGatewayModule,
    AuthGatewayModule,
  ],
  controllers: [OrdersController],
  providers: [
    {
      provide: 'CreateOrderUseCasePort',
      useClass: CreateOrderUseCase,
    },
  ],
})
export class AppModule {}
