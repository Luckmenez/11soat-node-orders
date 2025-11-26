import { Module } from '@nestjs/common';
import { OrdersController } from 'src/application/controller/orders.controller';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';

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
