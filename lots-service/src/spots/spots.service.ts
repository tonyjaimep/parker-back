import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { spot } from 'src/db/schema/spot';

@Injectable()
export class SpotsService {
  constructor(private readonly dbService: DbService) {}

  async markSpotAsAvailable(spotId: number) {
    await this.dbService.db
      .update(spot)
      .set({ isAvailable: true })
      .where(eq(spot.id, spotId));
  }

  async markSpotAsUnavailable(spotId: number) {
    await this.dbService.db
      .update(spot)
      .set({ isAvailable: false })
      .where(eq(spot.id, spotId));
  }
}
