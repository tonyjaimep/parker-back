import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { BearerStrategy } from './bearer.strategy';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PassportModule, FirebaseModule, UsersModule],
  providers: [AuthService, BearerStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
