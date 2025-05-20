import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-http-bearer';
import { IdentityService } from './identity.service';
import { UserPayload } from 'src/constants/types';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly identityService: IdentityService,
  ) {
    super();
  }

  async validate(token: string): Promise<UserPayload | null> {
    return this.identityService.getUserFromToken(token)
  }
}
