import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateReservationRequestDto {
  @IsNumber()
  @Type(() => Number)
  spotId: number;

  @IsNumber()
  @Type(() => Number)
  userId: number;
}
