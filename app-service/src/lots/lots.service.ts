import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LOTS_SERVICE } from 'src/constants/services';
import { Bounds, LotEditableFields } from './types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LotsService {
  constructor(@Inject(LOTS_SERVICE) private readonly lotsClient: ClientProxy) {}

  async createLot(
    creatorId: number,
    lotData: LotEditableFields,
    spotsCount: number,
  ) {
    return firstValueFrom(
      this.lotsClient.send('create-lot', {
        creatorId,
        lotData,
        spotsCount,
      }),
    );
  }

  async isLotOwner(lotId: number, userId: number) {
    return firstValueFrom(
      this.lotsClient.send('get-is-lot-owner', { lotId, userId }),
    );
  }

  async updateLot(lotId: number, updatedData: Partial<LotEditableFields>) {
    return firstValueFrom(
      this.lotsClient.send('get-is-lot-owner', { lotId, data: updatedData }),
    );
  }

  async getLots(config: { withAvailability?: boolean; bounds?: Bounds }) {
    return firstValueFrom(this.lotsClient.send('get-lots', config));
  }

  async deleteLot(lotId: number) {
    return firstValueFrom(this.lotsClient.send('delete-lot', lotId));
  }
}
