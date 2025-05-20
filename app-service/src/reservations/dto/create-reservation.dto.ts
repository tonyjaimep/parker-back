import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateReservationRequestDto {
  @IsNumber()
  @Type(() => Number)
  lotId: number;
}
