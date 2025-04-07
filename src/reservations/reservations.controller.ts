import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { UseAuth } from 'src/auth/decorators/use-auth.decorator';
import { ReservationsService } from './reservations.service';
import { CreateReservationRequestDto } from './dto/create-reservation.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { UserSelect } from 'src/users/types';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('/')
  @UseAuth()
  async createReservation(
    @User() user: UserSelect,
    @Body() createReservationRequestDto: CreateReservationRequestDto,
  ) {
    // 404 case:
    const lotExists = await this.reservationsService.doesLotExist(
      createReservationRequestDto.lotId,
    );

    if (!lotExists) {
      throw new NotFoundException();
    }

    try {
      return await this.reservationsService.createReservationIfSpotsAvailable({
        ...createReservationRequestDto,
        userId: user.id,
      });
    } catch (error) {
      if (error.message === 'No spots available') {
        throw new BadRequestException();
      }
      throw error;
    }
  }

  @Get('current')
  @UseAuth()
  async getCurrentReservation(@User() user: UserSelect) {
    return this.reservationsService.getUserCurrentReservation(user.id);
  }
}
