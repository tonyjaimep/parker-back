import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [ReservationsService],
  imports: [DbModule],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
