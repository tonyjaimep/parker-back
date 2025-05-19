import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { ConfigModule, ConfigService } from '@nestjs/config';
import schema from './db/schema';
import { DB_TAG } from './db/constants';

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
    FirebaseModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
