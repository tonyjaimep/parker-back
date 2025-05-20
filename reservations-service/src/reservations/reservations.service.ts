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
  ): Promise<ReservationsService> {
    const currentReservation = await this.getUserCurrentReservation(userId);

    if (currentReservation) {
      throw new Error('User already has active reservation');
    }

    // @ts-expect-error -- drizzle orm type inference sucks
    return this.dbService.db.insert(reservation).values({
      spotId,
      userId,
    });
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
