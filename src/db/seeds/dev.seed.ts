import { drizzle } from 'drizzle-orm/node-postgres';
import { lot } from '../schema/lot';
import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import { spot } from '../schema/spot';
import { getRandomMexicoCoordinates, truncateAllTables } from './utils';
import { LotSelect } from 'src/lots/types';
import schema from '../schema';

if (process.env.NODE_ENV !== 'development') {
  throw new Error("Can't run dev seeds in non-development environment");
}

if (!process.env.DB_URL) {
  throw new Error('DB_URL is a required environment variable');
}

async function main() {
  const db = drizzle(process.env.DB_URL, { schema, casing: 'snake_case' });

  await db.transaction(async () => {
    await truncateAllTables(db);

    // @ts-expect-error -- returning() does not return the correct type
    const lots: Array<LotSelect> = await db
      .insert(lot)
      .values(
        Array.from({ length: 10 }).map(() => {
          const location = getRandomMexicoCoordinates();

          return {
            name: `${faker.location.city()} lot`,
            address: faker.location.streetAddress(),
            location: sql`ST_SetSRID(ST_MakePoint(${location.lng}, ${location.lat}), 4326)`,
          };
        }),
      )
      .returning();

    await Promise.all(
      lots.map(async (lot) => {
        await db.insert(spot).values(
          Array.from({ length: 10 }).map(() => {
            return {
              lotId: lot.id,
              isAvailable: true,
            };
          }),
        );
      }),
    );
  });
}

main();
