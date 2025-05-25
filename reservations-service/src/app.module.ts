import { Module } from '@nestjs/common';
import { ReservationsModule } from './reservations/reservations.module';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import schema from './db/schema';
import { DB_TAG } from './db/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzlePGModule.registerAsync({
      tag: DB_TAG,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pg: {
          connection: 'client',
          config: {
            connectionString: configService.getOrThrow('DB_URL'),
          },
        },
        config: {
          dialect: 'postgresql',
          casing: 'snake_case',
          schema: { ...schema },
        },
      }),
    }),
    ReservationsModule,
  ],
})
export class AppModule {}
