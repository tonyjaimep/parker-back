import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-http-bearer';
import { IDENTITY_SERVICE } from 'src/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { UserPayload } from 'src/constants/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(IDENTITY_SERVICE) private identityService: ClientProxy) {
    super();
  }

  async validate(token: string): Promise<UserPayload | null> {
    const result = await firstValueFrom(
      this.identityService.send<UserPayload, { token: string }>(
        'get_user_from_token',
        { token },
      ),
    );

    return result;
  }
}
