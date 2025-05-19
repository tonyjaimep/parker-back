import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserEditableFields, UserSelect } from './types';
import { eq } from 'drizzle-orm';
import { user } from 'src/db/schema/user';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: DbService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async isUserVerified(user: Pick<UserSelect, 'firebaseUserId'>) {
    return await this.firebaseService.isUserVerified(user.firebaseUserId);
  }

  async updateUser(userId: number, data: Partial<UserEditableFields>) {
    return this.dbService.db
      .update(user)
      .set(data)
      .where(eq(user.id, userId))
      .returning();
  }

  async getUserById(id: number) {
    return this.dbService.db.query.user.findFirst({
      where: eq(user.id, id),
    });
  }

  async getUserByFirebaseUserId(firebaseUserId: string) {
    return this.dbService.db.query.user.findFirst({
      where: eq(user.firebaseUserId, firebaseUserId),
    });
  }

  async registerWithFirebaseToken(
    data: UserEditableFields,
    firebaseIdToken: string,
  ) {
    const decodedToken =
      await this.firebaseService.decodeIdToken(firebaseIdToken);

    if (!decodedToken) {
      throw new BadRequestException(
        'No fue posible decodificar el token obtenido',
      );
    }

    return this.registerWithFirebaseUid(data, decodedToken.uid);
  }

  async registerWithFirebaseUid(data: UserEditableFields, firebaseUid: string) {
    const inserted = await this.dbService.db
      .insert(user)
      .values({ ...data, firebaseUserId: firebaseUid })
      .returning();

    return inserted[0];
  }
}
