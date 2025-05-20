import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'get_is_email_available' })
  async checkEmailAvailability({ email }: { email: string }) {
    const isAvailable = await this.authService.isEmailAvailable(email);

    return { isAvailable };
  }
}
