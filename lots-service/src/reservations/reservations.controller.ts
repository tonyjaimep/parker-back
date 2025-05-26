import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ReservationPayload } from './types';
import { SpotsService } from 'src/spots/spots.service';

@Controller()
export class ReservationsController {
  constructor(private readonly spotsService: SpotsService) {}

  @EventPattern('reservation_created')
  async handleReservationCreated(data: ReservationPayload) {
    await this.spotsService.markSpotAsUnavailable(data.spotId);
  }

  @EventPattern('reservation_canceled')
  @EventPattern('reservation_expired')
  async handleReservationCanceled(data: ReservationPayload) {
    await this.spotsService.markSpotAsAvailable(data.spotId);
  }
}
