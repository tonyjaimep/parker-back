import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RESERVATIONS_SERVICE } from 'src/constants/services';
import { ReservationPayload } from './types';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(RESERVATIONS_SERVICE)
    private readonly reservationsClient: ClientProxy,
  ) {}

  async createReservation(userId: number, spotId: number) {
    return firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>(
        'create_reservation',
        { userId, spotId },
      ),
    );
  }

  async getUserCurrentReservation(userId: number) {
    return firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>(
        'get_user_current_reservation',
        { userId },
      ),
    );
  }
}
