import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { IdentityService } from './identity.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IDENTITY_SERVICE } from 'src/constants/services';
import { ConfigService } from '@nestjs/config';
import { BearerStrategy } from './bearer.strategy';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: IDENTITY_SERVICE,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('IDENTITY_SERVICE_HOST'),
            port: configService.get('IDENTITY_SERVICE_PORT') || 3000,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [IdentityService, BearerStrategy],
  exports: [],
  controllers: [AuthController, UsersController],
})
export class IdentityModule {}
