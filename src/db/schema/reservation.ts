import { serial, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { spot } from './spot';
import { price } from './price';
import { relations, sql } from 'drizzle-orm';

export const reservation = pgTable('reservations', {
  id: serial().primaryKey(),
  userId: integer().references(() => user.id, { onDelete: 'set null' }),
  spotId: integer()
    .references(() => spot.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  startsAt: timestamp().defaultNow().notNull(),
  endsAt: timestamp(),
  priceId: integer().references(() => price.id, { onDelete: 'cascade' }),
});

export const reservationRelations = relations(reservation, ({ one }) => ({
  user: one(user, { fields: [reservation.userId], references: [user.id] }),
  spot: one(spot, { fields: [reservation.spotId], references: [spot.id] }),
  price: one(price, { fields: [reservation.priceId], references: [price.id] }),
}));
