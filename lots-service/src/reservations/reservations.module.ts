import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { SpotsModule } from 'src/spots/spots.module';

@Module({
  controllers: [ReservationsController],
  imports: [SpotsModule],
})
export class ReservationsModule {}
