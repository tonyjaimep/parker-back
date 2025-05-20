import {
  geometry,
  integer,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { price } from './price';
import { relations } from 'drizzle-orm';

export const lot = pgTable('lot', {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  defaultPriceId: integer().references(() => price.id),
  address: varchar().notNull(),
  location: geometry({ type: 'point', mode: 'xy', srid: 4326 }).notNull(),
  ownerId: integer().notNull(),
});

export const lotRelations = relations(lot, ({ one }) => ({
  defaultPrice: one(price, {
    fields: [lot.defaultPriceId],
    references: [price.id],
    relationName: 'lot_prices',
  }),
}));
