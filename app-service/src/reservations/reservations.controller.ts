import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UserPayload } from 'src/constants/types';
import { UseAuth } from 'src/identity/decorators/use-auth.decorator';
import { User } from 'src/identity/decorators/user.decorator';
import { ReservationsService } from './reservations.service';
import { CreateReservationRequestDto } from './dto/create-reservation.dto';
import { LotsService } from 'src/lots/lots.service';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly lotsService: LotsService,
  ) {}

  @Post('/')
  @UseAuth()
  async createReservation(
    @User() user: UserPayload,
    @Body() createReservationRequestDto: CreateReservationRequestDto,
  ) {
    const availableSpotId = await this.lotsService.findAvailableSpotId(
      createReservationRequestDto.lotId,
    );

    if (!availableSpotId) {
      throw new BadRequestException({
        message: 'No spots available in this lot',
      });
    }

    return this.reservationsService.createReservation(user.id, availableSpotId);
  }

  @Get('current')
  @UseAuth()
  async getCurrentReservation(@User() user: UserPayload) {
    return this.reservationsService.getUserCurrentReservation(user.id);
  }
}
