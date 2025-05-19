import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('email/check')
  async checkEmailAvailability(@Query('email') email: string) {
    const isAvailable = await this.authService.isEmailAvailable(email);

    return { isAvailable };
  }
}
