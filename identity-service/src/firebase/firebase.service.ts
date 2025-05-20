import { Injectable } from '@nestjs/common';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import {
  getAuth,
  Auth,
  DecodedIdToken,
  FirebaseAuthError,
} from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private auth: Auth;

  constructor() {
    const firebase = initializeApp({
      // applicationDefault() loads ./credentials/service-account-file.json
      credential: applicationDefault(),
    });

    this.auth = getAuth(firebase);
  }

  async decodeIdToken(idToken: string): Promise<DecodedIdToken | null> {
    try {
      return await this.auth.verifyIdToken(idToken);
    } catch {
      return null;
    }
  }

  async isUserVerified(uid: string) {
    const user = await this.auth.getUser(uid);
    return user.emailVerified;
  }

  async isEmailAvailable(email: string) {
    try {
      const user = await this.auth.getUserByEmail(email);
      return !user;
    } catch (error) {
      const firebaseError = error as FirebaseAuthError;

      if (firebaseError.code === 'auth/user-not-found') {
        return true;
      }

      throw error;
    }
  }

  async closeAllSessions(uid: string) {
    return this.auth.revokeRefreshTokens(uid);
  }

  async deleteUser(uid: string) {
    return await this.auth.deleteUser(uid);
  }

  async createEmailAuthUser(email: string, password: string) {
    return await this.auth.createUser({
      email,
      password,
    });
  }

  async getToken(uid: string) {
    return await this.auth.createCustomToken(uid);
  }

  async signInWithEmailAndPassword(email: string) {
    const userCredential = await this.auth.getUserByEmail(email);
    return userCredential;
  }
}
