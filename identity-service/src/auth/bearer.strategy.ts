import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-http-bearer';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UsersService } from 'src/users/users.service';
import { UserSelect } from 'src/users/types';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async validate(token: string): Promise<UserSelect | null> {
    const decodedIdToken = await this.firebaseService.decodeIdToken(token);

    if (!decodedIdToken) {
      return null;
    }

    // @ts-expect-error -- don't have time for this
    return this.usersService.getUserByFirebaseUserId(decodedIdToken.uid);
  }
}
