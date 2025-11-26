import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ProductValidateResponse } from 'src/application/domain/dto/product-response.dto';
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
  async validateProducts(
    productIds: string[],
  ): Promise<ProductValidateResponse> {
    const { data } = await firstValueFrom(
      this.httpService.post<ProductValidateResponse>(
        `${this.productsServiceUrl}/validate-products`,
        { productIds },
      ),
    );

    return data;
  }
}
