import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async isEmailAvailable(email: string) {
    return this.firebaseService.isEmailAvailable(email);
  }
}
