import {
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Coordinates } from '../types';
import { Type } from 'class-transformer';

export class CreateLotRequestDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsObject({ always: true })
  @IsNotEmptyObject()
  @Type(() => Coordinates)
  location: Coordinates;

  @IsNumber()
  spotsCount: number;
}
