import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { reservation } from 'src/db/schema/reservation';
import { spot } from 'src/db/schema/spot';
import { and, eq, gt, gte, isNull, lte, or, sql } from 'drizzle-orm';
import { ReservationInsert, ReservationSelect } from './types';
import { lot } from 'src/db/schema/lot';

@Injectable()
export class ReservationsService {
  constructor(private dbService: DbService) {}

  async findAvailableSpot(
    lotId: number,
    time: Date = new Date(),
  ): Promise<Pick<typeof spot.$inferSelect, 'id'> | null> {
    const result = await this.dbService.db
      .select({ id: spot.id })
      .from(spot)
      .leftJoin(
        reservation,
        and(
          eq(spot.id, reservation.spotId),
          or(
            and(lte(reservation.startsAt, time), isNull(reservation.endsAt)),
            and(lte(reservation.startsAt, time), gte(reservation.endsAt, time)),
          ),
        ),
      )
      .where(
        and(
          eq(spot.lotId, lotId),
          eq(spot.isAvailable, true),
          isNull(reservation.id),
        ),
      )
      .orderBy(spot.id)
      .limit(1);

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }

  async createReservationIfSpotsAvailable({
    userId,
    lotId,
  }: {
    userId: number;
    lotId: number;
  }) {
    const spot = await this.findAvailableSpot(lotId);

    if (!spot) {
      throw new Error('No spots available');
    }

    // @ts-expect-error -- drizzle orm type inference sucks
    return this.dbService.db.insert(reservation).values({
      spotId: spot.id,
      userId,
    });
  }

  async doesLotExist(id: number) {
    const result =
      (await this.dbService.db.query.lot.findFirst({
        where: eq(lot.id, id),
        columns: { id: true },
      })) ?? null;

    return result !== null;
  }

  async getUserCurrentReservation(
    userId: number,
  ): Promise<ReservationSelect | null> {
    const result =
      (await this.dbService.db.query.reservation.findFirst({
        where: and(
          eq(reservation.userId, userId),
          or(isNull(reservation.endsAt), gt(reservation.endsAt, sql`now()`)),
        ),
      })) ?? null;

    return result;
  }
}
