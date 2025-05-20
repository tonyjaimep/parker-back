import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  ParseIntPipe,
  ForbiddenException,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { UseAuth } from 'src/auth/decorators/use-auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { CreateLotRequestDto } from './dto/create-lot.dto';
import { UpdateLotRequestDto } from './dto/update-lot.dto';
import { GetLotsQueryDto } from './types';
import { ParseNestedObjectPipe } from 'src/utils/pipes/parse-nested-object.pipe';
import { UserPayload } from 'src/constants/types';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}
  @Get()
  async getLots(
    @Query(ParseNestedObjectPipe, new ValidationPipe({ transform: true }))
    query: GetLotsQueryDto,
  ) {
    return this.lotsService.getLots({
      withAvailability: query.with_availability,
      bounds: query.bounds,
    });
  }

  @Post()
  @UseAuth()
  async createLot(
    @User() user: UserPayload,
    @Body() body: CreateLotRequestDto,
  ) {
    return this.lotsService.createLot(user.id, body, body.spotsCount);
  }

  @Patch('/:id')
  @UseAuth()
  async updateLot(
    @User() user: UserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedData: UpdateLotRequestDto,
  ) {
    const isOwner = await this.lotsService.isLotOwner(id, user.id);
    if (!isOwner) {
      throw new ForbiddenException('not lot owner');
    }
    return this.lotsService.updateLot(id, updatedData);
  }

  @Delete('/:id')
  @UseAuth()
  async deleteLot(
    @User() user: UserPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const isOwner = await this.lotsService.isLotOwner(id, user.id);
    if (!isOwner) {
      throw new ForbiddenException('not lot owner');
    }
    return this.lotsService.deleteLot(id);
  }
}
