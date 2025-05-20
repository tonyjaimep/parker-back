import { Controller, Query, ValidationPipe } from '@nestjs/common';
import { LotsService } from './lots.service';
import { GetLotsQueryDto, LotEditableFields } from './types';
import { ParseNestedObjectPipe } from 'src/utils/pipes/parse-nested-object.pipe';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @MessagePattern('get_lots')
  async getLots(
    @Query(ParseNestedObjectPipe, new ValidationPipe({ transform: true }))
    query: GetLotsQueryDto,
  ) {
    return this.lotsService.getLots({
      withAvailability: query.with_availability,
      bounds: query.bounds,
    });
  }

  @MessagePattern('create_lot')
  async createLot({
    creatorId,
    data,
    spotsCount,
  }: {
    creatorId: number;
    data: LotEditableFields;
    spotsCount: number;
  }) {
    return this.lotsService.createLot(creatorId, data, spotsCount);
  }

  @MessagePattern('update_lot')
  async updateLot({
    id,
    data,
  }: {
    id: number;
    data: Partial<LotEditableFields>;
  }) {
    return this.lotsService.updateLot(id, data);
  }

  @MessagePattern('delete_lot')
  async deleteLot({ id }: { id: number }) {
    return this.lotsService.deleteLot(id);
  }

  @MessagePattern('get_is_lot_owner')
  async getIsLotOwner({ id, userId }: { id: number, userId:number }) {
    return this.lotsService.isLotOwner(id, userId);
  }
}
