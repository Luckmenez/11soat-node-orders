import { Module } from '@nestjs/common';
import { OrdersController } from 'src/application/controller/orders.controller';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [
    {
      provide: 'CreateOrderUseCasePort',
      useClass: CreateOrderUseCase,
    },
  ],
})
export class AppModule {}
