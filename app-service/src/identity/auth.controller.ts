import { Controller, Get, Query } from '@nestjs/common';
import { IdentityService } from './identity.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly identityService: IdentityService) {}

  @Get('email/check')
  async checkEmailAvailability(@Query('email') email: string) {
    return this.identityService.isEmailAvailable(email);
  }
}
