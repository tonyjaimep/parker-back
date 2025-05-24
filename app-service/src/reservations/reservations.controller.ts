import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserPayload } from 'src/constants/types';
import { UseAuth } from 'src/identity/decorators/use-auth.decorator';
import { User } from 'src/identity/decorators/user.decorator';
import { ReservationsService } from './reservations.service';
import { CreateReservationRequestDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('/')
  @UseAuth()
  async createReservation(
    @User() user: UserPayload,
    @Body() createReservationRequestDto: CreateReservationRequestDto,
  ) {
    return this.reservationsService.createReservation(
      user.id,
      createReservationRequestDto.lotId,
    );
  }

  @Get('current')
  @UseAuth()
  async getCurrentReservation(@User() user: UserPayload) {
    return this.reservationsService.getUserCurrentReservation(user.id);
  }
}
