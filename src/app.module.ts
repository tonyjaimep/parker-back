import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { DB_TAG } from './db/constants';
import { LotsModule } from './lots/lots.module';
import { ReservationsModule } from './reservations/reservations.module';
import { MetricsModule } from './metrics/metrics.module';
import schema from './db/schema';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
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
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    FirebaseModule,
    LotsModule,
    ReservationsModule,
    MetricsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule {}
