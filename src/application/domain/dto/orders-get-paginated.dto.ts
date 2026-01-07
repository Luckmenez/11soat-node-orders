import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class GetOrdersPaginatedDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  page: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  limit: number;
}
