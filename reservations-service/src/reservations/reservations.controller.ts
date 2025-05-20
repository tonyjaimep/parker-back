import { BadRequestException, Controller } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationRequestDto } from './dto/create-reservation.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @MessagePattern('create_reservation')
  async createReservation(
    createReservationRequestDto: CreateReservationRequestDto,
  ) {
    try {
      const response = await this.reservationsService.createReservation(
        createReservationRequestDto.userId,
        createReservationRequestDto.spotId,
      );

      return response;
    } catch (error) {
      if (error.message == 'User already has active reservation') {
        throw new BadRequestException({ message: error.message });
      }

      throw error;
    }
  }

  @MessagePattern('get_user_current_reservation')
  async getUserCurrentReservation({ userId }: { userId: number }) {
    return this.reservationsService.getUserCurrentReservation(userId);
  }
}
