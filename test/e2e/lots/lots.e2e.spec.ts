import * as request from 'supertest';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Credentials, initializeE2eTestApp, truncateAllTables } from '../utils';
import { MockFirebaseService } from '../firebase/firebase.mock.service';
import { INestApplication } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DbService } from 'src/db/db.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import schema from 'src/db/schema';
import { spot } from 'src/db/schema/spot';
import { eq } from 'drizzle-orm';
import { lot } from 'src/db/schema/lot';

describe('Lots', () => {
  let app: INestApplication;
  let firebaseService: MockFirebaseService;
  let db: NodePgDatabase<typeof schema>;

  async function generateCredentials(): Promise<Credentials> {
    const usersService = app.get(UsersService);

    const firebaseToken = firebaseService.getValidIdToken();
    const user = await usersService.registerWithFirebase(
      {
        fullName: 'Test User',
        displayName: 'Test',
      },
      firebaseToken,
    );

    return {
      user,
      token: firebaseToken,
    };
  }

  beforeAll(async () => {
    app = await initializeE2eTestApp();
    firebaseService = app.get(FirebaseService);
    db = app.get(DbService).db;
    await app.init();
  });

  afterEach(async () => {
    await truncateAllTables(app.get(DbService).db);
  });

  describe('POST /lots', () => {
    it('fails if unauthenticated', () => {
      return request(app.getHttpServer()).post('/lots').send().expect(401);
    });

    it('enforces required properties', async () => {
      const credentials = await generateCredentials();

      return request(app.getHttpServer())
        .post('/lots')
        .send({
          name: 'foo',
        })
        .auth(credentials.token, { type: 'bearer' })
        .expect(400);
    });

    it('creates and returns a lot', async () => {
      const credentials = await generateCredentials();

      return request(app.getHttpServer())
        .post('/lots')
        .send({
          name: 'Example Lot',
          address: 'Address #123',
          spotsCount: 20,
          location: {
            latitude: 123.456,
            longitude: 23.456,
          },
        })
        .auth(credentials.token, { type: 'bearer' })
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject({
            name: 'Example Lot',
            address: 'Address #123',
          });
        });
    });

    it('creates as many lot spots as specified in the DTO', async () => {
      const credentials = await generateCredentials();

      const response = await request(app.getHttpServer())
        .post('/lots')
        .send({
          name: 'Example Lot',
          address: 'Address #123',
          spotsCount: 20,
          location: {
            latitude: 123.456,
            longitude: 23.456,
          },
        })
        .auth(credentials.token, { type: 'bearer' })
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject({
            name: 'Example Lot',
            address: 'Address #123',
          });
        });

      const createdLotId: number = response.body.id;

      const createdSpotsCount = await db.$count(
        spot,
        eq(spot.lotId, createdLotId),
      );

      expect(createdSpotsCount).toBe(20);
    });
  });

  describe('PATCH /lots', () => {
    it('fails with 403 if not lot owner', async () => {
      const ownerCredentials = await generateCredentials();
      const nonOwnerCredentials = await generateCredentials();

      let createdLotId: number;

      // create lot with one user
      await request(app.getHttpServer())
        .post('/lots')
        .send({
          name: 'Example Lot',
          address: 'Address #123',
          spotsCount: 20,
          location: {
            latitude: 123.456,
            longitude: 23.456,
          },
        })
        .auth(ownerCredentials.token, { type: 'bearer' })
        .expect(201)
        .then((response) => {
          createdLotId = response.body.id;
        });

      // patches with different user
      return request(app.getHttpServer())
        .patch(`/lots/${createdLotId}`)
        .send({
          address: 'New Address',
        })
        .auth(nonOwnerCredentials.token, { type: 'bearer' })
        .expect(403);
    });

    it('updates the properties of a lot', async () => {
      const credentials = await generateCredentials();
      let createdLotId: number;

      await request(app.getHttpServer())
        .post('/lots')
        .send({
          name: 'Example Lot',
          address: 'Address #123',
          spotsCount: 20,
          location: {
            latitude: 123.456,
            longitude: 23.456,
          },
        })
        .auth(credentials.token, { type: 'bearer' })
        .expect(201)
        .then((response) => {
          createdLotId = response.body.id;
        });

      return request(app.getHttpServer())
        .patch(`/lots/${createdLotId}`)
        .send({
          address: 'New Address',
        })
        .auth(credentials.token, { type: 'bearer' })
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
      const credentials = await generateCredentials();
      const testSet = ['GETLOTSTESTADDRESS1', 'GETLOTSTESTADDRESS2'];

      await Promise.all(
        testSet.map(async (testAddress) => {
          await request(app.getHttpServer())
            .post('/lots')
            .send({
              name: `GET /lots test address: ${testAddress}`,
              address: testAddress,
              spotsCount: 1,
              location: { latitude: 1, longitude: 1 },
            })
            .auth(credentials.token, { type: 'bearer' })
            .expect(201);
        }),
      );

      return request(app.getHttpServer())
        .get('/lots')
        .expect(200)
        .expect((response) => {
          expect(response.body.length).toBeGreaterThanOrEqual(testSet.length);
          expect(response.body).toContainEqual(
            expect.objectContaining({ address: testSet[0] }),
          );
          expect(response.body).toContainEqual(
            expect.objectContaining({ address: testSet[1] }),
          );
        });
    });
  });

  describe('DELETE /lots', () => {
    it('forbids non-owners from deleting a lot', async () => {
      const ownerCredentials = await generateCredentials();
      const nonOwnerCredentials = await generateCredentials();

      let createdLotId: number;

      // create lot with one user
      await request(app.getHttpServer())
        .post('/lots')
        .send({
          name: 'Example Lot',
          address: 'Address #123',
          spotsCount: 20,
          location: {
            latitude: 123.456,
            longitude: 23.456,
          },
        })
        .auth(ownerCredentials.token, { type: 'bearer' })
        .expect(201)
        .then((response) => {
          createdLotId = response.body.id;
        });

      // patches with different user
      return request(app.getHttpServer())
        .delete(`/lots/${createdLotId}`)
        .auth(nonOwnerCredentials.token, { type: 'bearer' })
        .expect(403);
    });

    it('deletes a lot and its spots', async () => {
      const credentials = await generateCredentials();

      let createdLotId: number;

      // create lot with one user
      await request(app.getHttpServer())
        .post('/lots')
        .send({
          name: 'Example Lot',
          address: 'Address #123',
          spotsCount: 20,
          location: {
            latitude: 123.456,
            longitude: 23.456,
          },
        })
        .auth(credentials.token, { type: 'bearer' })
        .expect(201)
        .then((response) => {
          createdLotId = response.body.id;
        });

      await request(app.getHttpServer())
        .delete(`/lots/${createdLotId}`)
        .auth(credentials.token, { type: 'bearer' })
        .expect(200);

      const spotsCount = await db.$count(spot, eq(spot.lotId, createdLotId));
      expect(spotsCount).toBe(0);
      const existingLot = await db.query.lot.findFirst({
        where: eq(lot.id, createdLotId),
      });
      expect(existingLot).toBeFalsy();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
