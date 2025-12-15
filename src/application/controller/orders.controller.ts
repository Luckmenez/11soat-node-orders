import { Body, Controller, Inject, Post, Headers } from '@nestjs/common';
import { CreateOrderDto } from 'src/application/domain/dto/order.db.interface';
import { CreateOrderUseCasePort } from 'src/application/ports/input/order.use-case.port';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('CreateOrderUseCasePort')
    private readonly createOrderUseCase: CreateOrderUseCasePort,
  ) {}

  @Post('create-order')
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('Authorization') token: string,
  ) {
    return this.createOrderUseCase.execute(createOrderDto, token);
  }
}
