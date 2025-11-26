import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from 'src/application/controller/orders.controller';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { ProductGatewayModule } from './infrastructure/gateway/products.gateway.module';
import configuration from './infrastructure/configuration/configuration';
import { validationSchema } from 'src/infrastructure/configuration/validation.schema';

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
    ProductGatewayModule,
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
