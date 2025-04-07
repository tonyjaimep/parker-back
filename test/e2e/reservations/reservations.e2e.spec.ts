import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { MockFirebaseService } from '../firebase/firebase.mock.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Credentials, initializeE2eTestApp, truncateAllTables } from '../utils';
import { UsersService } from 'src/users/users.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { DbService } from 'src/db/db.service';
import schema from 'src/db/schema';
import { reservation } from 'src/db/schema/reservation';
import { spot } from 'src/db/schema/spot';
import { createLot } from '../lots/utils';
import { eq } from 'drizzle-orm';
import { lot } from 'src/db/schema/lot';

describe('Reservations', () => {
  let app: INestApplication;
  let firebaseService: MockFirebaseService;
  let db: NodePgDatabase<typeof schema>;
  let testSpot: typeof spot.$inferSelect;
  let testLot: typeof lot.$inferSelect;
  let credentials: Credentials;

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

  beforeEach(async () => {
    credentials = await generateCredentials();
    const lotResponse = await createLot(app, credentials, {
      spotsCount: 1,
      name: 'Test Lot',
      address: 'Test Address',
      location: {
        latitude: 0.0,
        longitude: 0.0,
      },
    });

    testLot = lotResponse.body;

    testSpot = await db.query.spot.findFirst({
      where: eq(spot.lotId, testLot.id),
    });
  });

  afterEach(async () => {
    await truncateAllTables(app.get(DbService).db);
  });

  describe('POST /reservations', () => {
    it('creates a reservation if none has been created', async () => {
      await request(app.getHttpServer())
        .post('/reservations')
        .auth(credentials.token, { type: 'bearer' })
        .send({ lotId: testLot.id })
        .expect(201);

      const reservations = await db.query.reservation.findMany();

      expect(reservations.length).toEqual(1);
      expect(reservations[0]).toEqual(
        expect.objectContaining({
          spotId: testSpot.id,
          userId: credentials.user.id,
        }),
      );
    });

    it('returns an http exception if there is an active reservation already', async () => {
      const existingReservation = await db
        .insert(reservation)
        .values({
          spotId: testSpot.id,
        })
        .returning({ id: reservation.id });

      await request(app.getHttpServer())
        .post('/reservations')
        .auth(credentials.token, { type: 'bearer' })
        .send({ lotId: testLot.id })
        .expect(400);

      const reservations = await db.query.reservation.findMany();

      expect(reservations.length).toEqual(1);
      expect(reservations[0].id).toEqual(existingReservation[0].id);
    });

    it('fails if the lot id does not exist', async () => {
      await request(app.getHttpServer())
        .post('/reservations')
        .auth(credentials.token, { type: 'bearer' })
        .send({ lotId: testLot.id + 10 })
        .expect(404);

      const reservations = await db.query.reservation.findMany();

      expect(reservations.length).toEqual(0);
    });

    it('fails if the spot is not available', async () => {
      await db
        .update(spot)
        // @ts-expect-error -- drizzle doesn't like me
        .set({ isAvailable: false })
        .where(eq(spot.id, testSpot.id));

      await request(app.getHttpServer())
        .post('/reservations')
        .auth(credentials.token, { type: 'bearer' })
        .send({ lotId: testLot.id })
        .expect(400);

      const reservations = await db.query.reservation.findMany();

      expect(reservations.length).toEqual(0);
    });

    it('fails if not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/reservations')
        .send({ lotId: testLot.id })
        .expect(401);
    });
  });

  describe('GET /reservations/current', () => {
    it('fails with 401 if the user is not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/reservations/current')
        .expect(401);
    });

    it('returns the current reservation if there is one for this user', async () => {
      const [createdReservation] = await db
        .insert(reservation)
        // @ts-expect-error -- damn drizzle orm
        .values({
          spotId: testSpot.id,
          userId: credentials.user.id,
        })
        .returning();

      const response = await request(app.getHttpServer())
        .get('/reservations/current')
        .auth(credentials.token, { type: 'bearer' })
        .expect(200);

      expect(response.body.id).toEqual(createdReservation.id);
    });

    it('returns an empty response if there is no current active reservation for this user', async () => {
      const response = await request(app.getHttpServer())
        .get('/reservations/current')
        .auth(credentials.token, { type: 'bearer' })
        .expect(200);

      expect(response.body).toEqual({});
    });
  });
});
