import { reservation } from 'src/db/schema/reservation';

export type ReservationInsert = {
  userId: number;
  spotId: number;
  priceId?: number;
};

export type ReservationSelect = typeof reservation.$inferSelect;
