import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { LotEditableFields } from './types';
import { lot } from 'src/db/schema/lot';
import { and, eq, sql } from 'drizzle-orm';
import { lotsToUsers } from 'src/db/schema/lot-to-users';
import { spot } from 'src/db/schema/spot';

@Injectable()
export class LotsService {
  constructor(private dbService: DbService) {}

  async createLot(
    creatorId: number,
    lotData: LotEditableFields,
    spotsCount: number,
  ) {
    return this.dbService.db.transaction(async (tx) => {
      const createdLots = await tx
        .insert(lot)
        .values({
          name: lotData.name,
          address: lotData.address,
          location: sql`ST_SetSRID(ST_MakePoint(${lotData.location.longitude}, ${lotData.location.latitude}), 4326)`,
        })
        .returning();

      const createdLot = createdLots[0];

      await tx.insert(lotsToUsers).values({
        userId: creatorId,
        lotId: createdLot.id,
      });

      await tx.insert(spot).values(
        Array.from({ length: spotsCount }).map(() => ({
          lotId: createdLot.id,
        })),
      );

      return createdLot;
    });
  }

  async isLotOwner(lotId: number, userId: number) {
    const result = await this.dbService.db.query.lotsToUsers.findFirst({
      where: and(eq(lotsToUsers.lotId, lotId), eq(lotsToUsers.userId, userId)),
    });

    return !!result;
  }

  async updateLot(lotId: number, updatedData: Partial<LotEditableFields>) {
    const updatedLots = await this.dbService.db
      .update(lot)
      .set({
        name: updatedData.name,
        address: updatedData.address,
        location: updatedData.location
          ? sql`ST_SetSRID(ST_MakePoint(${updatedData.location.longitude}, ${updatedData.location.latitude}), 4326)`
          : undefined,
      })
      .where(eq(lot.id, lotId))
      .returning();

    return updatedLots[0];
  }

  async getLots() {
    return this.dbService.db.select().from(lot);
  }

  async deleteLot(lotId: number) {
    return this.dbService.db.delete(lot).where(eq(lot.id, lotId));
  }
}
