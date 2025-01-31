import { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from 'src/firebase/firebase.service';

const VALID_ID_TOKEN_PREFIX = 'valid-firebase-id-token';
const VALID_UID_PREFIX = 'valid-firebase-uid';
const NON_VERIFIED_USER_ID_PREFIX = `${VALID_UID_PREFIX}-non-verified`;
const NON_AVAILABLE_EMAIL_PREFIX = `non-available`;

//@ts-expect-error -- auth is not used, just a mock service
export class MockFirebaseService implements FirebaseService {
  constructor() {}

  // ensure consistency in user id when decoding the same token multiple times
  private tokensToIds = new Map<string, string>();

  async decodeIdToken(idToken: string): Promise<DecodedIdToken | null> {
    if (!this.isValidIdToken(idToken)) {
      return null;
    }

    if (!this.tokensToIds.has(idToken)) {
      this.tokensToIds.set(idToken, this.getValidUserId());
    }

    const uid = this.tokensToIds.get(idToken);

    return {
      uid,
      // @ts-expect-error -- not needed
      firebase: {},
    };
  }

  async isUserVerified(uid: string): Promise<boolean> {
    return !this.isNonVerifiedUserId(uid);
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    return !this.isNonAvailableEmail(email);
  }

  async closeAllSessions(_uid: string): Promise<void> {}

  async deleteUser(_uid: string): Promise<void> {}

  getValidIdToken() {
    return `${VALID_ID_TOKEN_PREFIX}${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  isValidIdToken(tentativeToken: string) {
    return tentativeToken.startsWith(VALID_ID_TOKEN_PREFIX);
  }

  getValidUserId() {
    return `${VALID_UID_PREFIX}${Date.now()}`;
  }

  isValidUserId(uid: string) {
    return uid.startsWith(VALID_ID_TOKEN_PREFIX);
  }

  getNonVerifiedUserId() {
    return `${NON_VERIFIED_USER_ID_PREFIX}${Date.now()}`;
  }

  isNonVerifiedUserId(uid: string) {
    return uid.startsWith(NON_VERIFIED_USER_ID_PREFIX);
  }

  getNonAvailableEmail() {
    return `${NON_AVAILABLE_EMAIL_PREFIX}+${Date.now()}@labuapp.com`;
  }

  isNonAvailableEmail(email: string) {
    return email.startsWith(NON_AVAILABLE_EMAIL_PREFIX);
  }
}
