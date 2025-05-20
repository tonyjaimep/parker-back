import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IDENTITY_SERVICE } from 'src/constants/services';
import { UserPayload } from 'src/constants/types';
import { RegisterUserRequestDto } from './dto/register-user.dto';
import { UpdateUserRequestDto } from './dto/update-user.dto';

@Injectable()
export class IdentityService {
  constructor(
    @Inject(IDENTITY_SERVICE) private readonly identityClient: ClientProxy,
  ) {}

  async isEmailAvailable(email: string) {
    return firstValueFrom(
      this.identityClient.send<{ isAvaliable: boolean }>(
        'get_is_email_available',
        {
          email,
        },
      ),
    );
  }

  async registerUserWithFirebaseToken(
    user: RegisterUserRequestDto,
    token: string,
  ) {
    return firstValueFrom(
      this.identityClient.send<UserPayload>(
        'register_user_with_firebase_token',
        {
          user,
          token,
        },
      ),
    );
  }

  async getUserFromToken(token: string) {
    return firstValueFrom(
      this.identityClient.send<UserPayload>('get_user_from_token', { token }),
    );
  }

  async updateUser(id: number, data: UpdateUserRequestDto) {
    return firstValueFrom(
      this.identityClient.send<UserPayload>('update_user', { id, data }),
    );
  }

  async getIsUserVerified(id: number) {
    return firstValueFrom(
      this.identityClient.send<{ isVerified: boolean }>(
        'get_is_user_verified',
        { id },
      ),
    );
  }
}
