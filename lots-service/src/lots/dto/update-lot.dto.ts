import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Coordinates } from '../types';
import { Type } from 'class-transformer';

export class UpdateLotRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsObject()
  @IsOptional()
  @Type(() => Coordinates)
  location?: Coordinates;

  @IsNumber()
  @IsOptional()
  spotsCount?: number;
}
