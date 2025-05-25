import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DbModule } from 'src/db/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RABBITMQ_SERVICE } from '../constants';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';

@Module({
  providers: [ReservationsService],
  imports: [
    DbModule,
    ClientsModule.registerAsync([
      {
        name: RABBITMQ_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<RmqUrl>('RABBITMQ_URL')],
            queue: 'reservations',
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
