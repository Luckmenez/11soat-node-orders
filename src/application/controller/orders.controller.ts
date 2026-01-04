import {
  Body,
  Controller,
  Inject,
  Post,
  Headers,
  Get,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from 'src/application/domain/dto/order.db.interface';
import { CreateOrderUseCasePort } from 'src/application/ports/input/create-order.port';
import { GetOrdersPaginatedDto } from '../domain/dto/orders-get-paginated.dto';
import { GetOrdersPaginatedPort } from '../ports/input/get-orders-paginated.port';
import { UpdateOrderPaymentPort } from '../ports/input/patch-order-payment.port';
import { UpdateOrderPaymentDto } from '../domain/dto/order.update-payment.dto';
import { DeleteOrderUseCasePort } from '../ports/input/delete-order.port';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('CreateOrderUseCasePort')
    private readonly createOrderUseCase: CreateOrderUseCasePort,
    @Inject('GetOrdersPaginatedUseCasePort')
    private readonly getOrdersPaginatedUseCase: GetOrdersPaginatedPort,
    @Inject('UpdateOrderPaymentUseCasePort')
    private readonly updateOrderPaymentUseCase: UpdateOrderPaymentPort,
    @Inject('DeleteOrderUseCasePort')
    private readonly deleteOrderUseCase: DeleteOrderUseCasePort,
  ) {}

  @Post('create-order')
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('Authorization') token: string,
  ) {
    return this.createOrderUseCase.execute(createOrderDto, token);
  }

  @Get('get-paginated')
  getOrdersPaginated(@Query() getOrdersPaginatedDto: GetOrdersPaginatedDto) {
    return this.getOrdersPaginatedUseCase.execute({
      page: Number(getOrdersPaginatedDto.page),
      limit: Number(getOrdersPaginatedDto.limit),
    });
  }

  @Patch('update-order-payment/')
  updateOrderPayment(@Body() updateOrderPaymentBody: UpdateOrderPaymentDto) {
    console.log('UpdateOrderPaymentDto:', updateOrderPaymentBody);
    return this.updateOrderPaymentUseCase.execute(updateOrderPaymentBody);
  }

  @Delete('delete-order/:orderId')
  deleteOrderById(@Param('orderId') orderId: string) {
    return this.deleteOrderUseCase.execute({
      orderId,
    });
  }
}
