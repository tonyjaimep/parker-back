import * as request from 'supertest';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Credentials, initializeAppModule } from '../utils';
import { MockFirebaseService } from '../firebase/firebase.mock.service';
import { INestApplication } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

describe('Lots', () => {
  let app: INestApplication;
  let firebaseService: MockFirebaseService;
  let validCredentials: Credentials;

  beforeAll(async () => {
    const moduleRef = await initializeAppModule();
    app = moduleRef.createNestApplication();
    firebaseService = moduleRef.get(FirebaseService);
    await app.init();

    const usersService = moduleRef.get(UsersService);

    const firebaseToken = firebaseService.getValidIdToken();
    const user = await usersService.registerWithFirebase(
      {
        fullName: 'Test User',
        displayName: 'Test',
      },
      firebaseToken,
    );

    validCredentials = {
      user,
      token: firebaseToken,
    };
  });

  describe('POST /lots', () => {
    it('fails if unauthenticated', () => {
      return request(app.getHttpServer()).post('/lots').send().expect(403);
    });

    it('enforces required properties', () => {
      const token = firebaseService.getValidIdToken();
      return request(app.getHttpServer())
        .post('/lots')
        .send()
        .auth(token, { type: 'bearer' })
        .expect(400);
    });

    it('creates and returns a lot', () => {
      /*
      jest
        .spyOn(geocodingService, 'geocodeAddress')
        .mockResolvedValueOnce({ latitude: 123.456, longitude: 23.456 });
      */

      return request(app.getHttpServer())
        .post('/lots')
        .send({
          name: 'Example Lot',
          address: 'Address #123',
          googlePlaceId: 123,
        })
        .auth(validCredentials.token, { type: 'bearer' })
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject({
            name: 'Example Lot',
            address: 'Address #123',
            latitude: 123.456,
            longitude: 23.456,
          });
        });
    });
  });

  describe('PATCH /lots', () => {
    it('fails with 403 if not lot owner', async () => {
      // create lot with one user
      await request(app.getHttpServer())
        .post('/lots')
        .send({
          name: 'Example Lot',
          address: 'Address #123',
          googlePlaceId: 123,
        })
        .auth(validCredentials.token, { type: 'bearer' })
        .expect(201);

      // patches with different user
      return request(app.getHttpServer())
        .patch('/lots')
        .send({
          address: 'New Address',
        })
        .auth(firebaseService.getValidIdToken(), { type: 'bearer' })
        .expect(403);
    });

    it('updates the properties of a lot', async () => {
      await request(app.getHttpServer())
        .post('/lots')
        .send({
          name: 'Example Lot',
          address: 'Address #123',
          googlePlaceId: 123,
        })
        .auth(validCredentials.token, { type: 'bearer' })
        .expect(201);

      return request(app.getHttpServer())
        .patch('/lots')
        .send({
          address: 'New Address',
        })
        .auth(validCredentials.token, { type: 'bearer' })
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            address: 'New Address',
          });
        });
    });
  });

  describe('GET /lots', () => {
    it('returns a list of lots in the database', async () => {
      const testSet = ['GETLOTSTESTADDRESS1', 'GETLOTSTESTADDRESS2'];

      await Promise.all(
        testSet.map(async (testAddress) => {
          await request(app.getHttpServer())
            .post('/lots')
            .send({
              name: `GET /lots test address: ${testAddress}`,
              address: testAddress,
              googlePlaceId: 123,
            })
            .auth(validCredentials.token, { type: 'bearer' })
            .expect(201);
        }),
      );

      return request(app.getHttpServer())
        .get('/lots')
        .expect(200)
        .expect((response) => {
          expect(response.body.length).toBeGreaterThanOrEqual(testSet.length);
          expect(response.body).toContain(
            expect.objectContaining({ address: testSet[0] }),
          );
          expect(response.body).toContain(
            expect.objectContaining({ address: testSet[1] }),
          );
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
