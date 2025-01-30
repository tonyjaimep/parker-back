import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { FirebaseService } from '../../../src/firebase/firebase.service';
import { MockFirebaseService } from '../firebase/firebase.mock.service';
import { user } from 'src/db/schema/user';

describe('Auth', () => {
  let app: INestApplication;

  const firebaseService = new MockFirebaseService();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseService)
      .useValue(firebaseService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('GET /auth/email/check', () => {
    it('returns false for a non available address', async () => {
      const nonAvailableEmail = firebaseService.getNonAvailableEmail();

      return request(app.getHttpServer())
        .get(`/auth/email/check?email=${nonAvailableEmail}`)
        .expect(200)
        .expect({ isAvailable: false });
    });

    it('returns false for a non available address', async () => {
      return request(app.getHttpServer())
        .get(`/auth/email/check?email=someother@email.com`)
        .expect(200)
        .expect({ isAvailable: true });
    });
  });

  describe('POST /users/me', () => {
    it('returns created user', async () => {
      return request(app.getHttpServer())
        .post('/users/me')
        .send({
          fullName: 'John Doe',
          displayName: 'John',
        })
        .auth(firebaseService.getValidIdToken(), { type: 'bearer' })
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject({
            fullName: 'John Doe',
            displayName: 'John',
          });
        });
    });
  });

  describe('GET /users/me', () => {
    it('fails if not authenticated', async () => {
      return request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('returns the current user if authenticated', async () => {
      const idToken = firebaseService.getValidIdToken();
      let createdUser: typeof user.$inferSelect;

      await request(app.getHttpServer())
        .post('/users/me')
        .send({
          fullName: 'John Doe',
          displayName: 'John',
        })
        .auth(idToken, { type: 'bearer' })
        .expect(201)
        .expect((response) => {
          createdUser = response.body;
        });

      jest
        .spyOn(firebaseService, 'getValidUserId')
        .mockImplementationOnce(() => createdUser.firebaseUserId);

      return request(app.getHttpServer())
        .get('/users/me')
        .auth(idToken, { type: 'bearer' })
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject(createdUser);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
