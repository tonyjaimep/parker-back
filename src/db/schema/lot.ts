import {
  geometry,
  integer,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { price } from './price';
import { relations } from 'drizzle-orm';
import { spot } from './spot';
import { lotsToUsers } from './lot-to-users';

export const lot = pgTable('lot', {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  defaultPriceId: integer().references(() => price.id),
  address: varchar().notNull(),
  location: geometry({ type: 'point', mode: 'xy', srid: 4326 }).notNull(),
});

export const lotRelations = relations(lot, ({ one, many }) => ({
  spots: many(spot, { relationName: 'lot_spots' }),
  defaultPrice: one(price, {
    fields: [lot.defaultPriceId],
    references: [price.id],
    relationName: 'lot_prices',
  }),
  lotsToUsers: many(lotsToUsers, { relationName: 'lots_to_users__lot' }),
}));
