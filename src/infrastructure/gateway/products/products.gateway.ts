import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { OrderProductDto } from 'src/application/domain/dto/order.product.dto';
import { ProductGatewayPort } from 'src/application/ports/output/product.gateway.port';

@Injectable()
export class ProductGateway implements ProductGatewayPort {
  private readonly productsServiceUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productsServiceUrl = this.configService.get<string>(
      'PRODUCT_GATEWAY_URL',
    );
  }

  async sendToPreparation(products: OrderProductDto): Promise<void> {
    await firstValueFrom(
      this.httpService.post<void>(`${this.productsServiceUrl}/orders`, {
        ...products,
      }),
    );
  }
}
