import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { reservation } from 'src/db/schema/reservation';
import { and, eq, gt, isNull, or, sql } from 'drizzle-orm';
import { ReservationSelect } from './types';

@Injectable()
export class ReservationsService {
  constructor(private dbService: DbService) {}

  async createReservation(
    userId: number,
    spotId: number,
  ): Promise<ReservationSelect> {
    const currentReservation = await this.getUserCurrentReservation(userId);

    if (currentReservation) {
      throw new Error('User already has active reservation');
    }

    const insertedReservations = await this.dbService.db
      .insert(reservation)
      .values({
        spotId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .returning();

    return insertedReservations[0];
  }

  async getUserCurrentReservation(
    userId: number,
  ): Promise<ReservationSelect | null> {
    const result =
      (await this.dbService.db.query.reservation.findFirst({
        where: and(
          eq(reservation.userId, userId),
          and(
            isNull(reservation.checkOutAt),
            gt(reservation.expiresAt, sql`now()`),
          ),
        ),
      })) ?? null;

    return result;
  }
}
