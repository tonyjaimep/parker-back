import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { FirebaseService } from '../../../src/firebase/firebase.service';
import { MockFirebaseService } from '../firebase/firebase.mock.service';
import { user } from 'src/db/schema/user';
import { initializeE2eTestApp, truncateAllTables } from '../utils';
import { DbService } from 'src/db/db.service';

describe('Auth', () => {
  let app: INestApplication;
  let firebaseService: MockFirebaseService;

  beforeAll(async () => {
    app = await initializeE2eTestApp();
    firebaseService = app.get(FirebaseService);
    await app.init();
  });

  afterEach(async () => {
    await truncateAllTables(app.get(DbService).db);
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
