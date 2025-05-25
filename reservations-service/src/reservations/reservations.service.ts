import { Inject, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { reservation } from 'src/db/schema/reservation';
import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import { ReservationSelect } from './types';
import { RABBITMQ_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ReservationsService {
  constructor(
    private dbService: DbService,
    @Inject(RABBITMQ_SERVICE)
    private readonly rabbitMqClient: ClientProxy,
  ) {}

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

    const createdReservation = insertedReservations[0];

    this.rabbitMqClient.emit('reservation_created', createdReservation);

    return createdReservation;
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
