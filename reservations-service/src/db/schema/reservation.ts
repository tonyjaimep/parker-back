import { serial, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const reservation = pgTable('reservations', {
  id: serial().primaryKey(),
  userId: integer().notNull(),
  spotId: integer().notNull(),
  expiresAt: timestamp(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  checkInAt: timestamp(),
  checkOutAt: timestamp(),
});
