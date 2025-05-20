import { serial, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const reservation = pgTable('reservations', {
  id: serial().primaryKey(),
  userId: integer().notNull(),
  spotId: integer().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  startsAt: timestamp().defaultNow().notNull(),
  endsAt: timestamp(),
});
