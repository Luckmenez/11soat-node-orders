import { Body, Controller, Inject, Post, Headers, Get } from '@nestjs/common';
import { CreateOrderDto } from 'src/application/domain/dto/order.db.interface';
import { CreateOrderUseCasePort } from 'src/application/ports/input/create-order.port';
import { GetOrdersPaginatedDto } from '../domain/dto/orders-get-paginated.dto';
import { GetOrdersPaginatedPort } from '../ports/input/get-orders-paginated.port';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('CreateOrderUseCasePort')
    private readonly createOrderUseCase: CreateOrderUseCasePort,
    @Inject('GetOrdersPaginatedUseCasePort')
    private readonly getOrdersPaginatedUseCase: GetOrdersPaginatedPort,
  ) {}

  @Post('create-order')
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('Authorization') token: string,
  ) {
    return this.createOrderUseCase.execute(createOrderDto, token);
  }

  @Get('get-paginated')
  getOrdersPaginated(@Body() getOrdersPaginatedDto: GetOrdersPaginatedDto) {
    return this.getOrdersPaginatedUseCase.execute({
      page: getOrdersPaginatedDto.page,
      limit: getOrdersPaginatedDto.limit,
    });
  }
}
