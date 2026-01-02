import {
  Body,
  Controller,
  Inject,
  Post,
  Headers,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { CreateOrderDto } from 'src/application/domain/dto/order.db.interface';
import { CreateOrderUseCasePort } from 'src/application/ports/input/create-order.port';
import { GetOrdersPaginatedDto } from '../domain/dto/orders-get-paginated.dto';
import { GetOrdersPaginatedPort } from '../ports/input/get-orders-paginated.port';
import { UpdateOrderPaymentPort } from '../ports/input/patch-order-payment.port';
import {
  UpdateOrderParamPaymentDto,
  UpdateOrderPaymentDto,
} from '../domain/dto/order.update-payment.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('CreateOrderUseCasePort')
    private readonly createOrderUseCase: CreateOrderUseCasePort,
    @Inject('GetOrdersPaginatedUseCasePort')
    private readonly getOrdersPaginatedUseCase: GetOrdersPaginatedPort,
    @Inject('UpdateOrderPaymentUseCasePort')
    private readonly updateOrderPaymentUseCase: UpdateOrderPaymentPort,
  ) {}

  @Post('create-order')
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('Authorization') token: string,
  ) {
    return this.createOrderUseCase.execute(createOrderDto, token);
  }

  @Get('get-paginated/:page/:limit')
  getOrdersPaginated(@Param() getOrdersPaginatedDto: GetOrdersPaginatedDto) {
    return this.getOrdersPaginatedUseCase.execute({
      page: getOrdersPaginatedDto.page,
      limit: getOrdersPaginatedDto.limit,
    });
  }

  @Patch('update-order-payment/:orderId')
  updateOrderPayment(
    @Param() updateOrderPayment: UpdateOrderParamPaymentDto,
    @Body() updateOrderPaymentBody: UpdateOrderPaymentDto,
  ) {
    return this.updateOrderPaymentUseCase.execute(
      updateOrderPayment,
      updateOrderPaymentBody,
    );
  }
}
