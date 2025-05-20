export type ReservationInsert = {
  userId: number;
  spotId: number;
  priceId?: number;
};

export type ReservationPayload = {
  id: number;
  userId: number;
  spotId: number;
  createdAt: string;
  updatedAt: string;
  startsAt: string;
  endsAt: string;
};
