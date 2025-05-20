import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { lot } from './lot';
import { spot } from './spot';
import { currency } from './currency';

export const price = pgTable('price', {
  id: serial().primaryKey(),
  name: varchar(),
  currency: currency().notNull().default('mxn').notNull(),
  amount: integer().notNull(),
  lotId: integer()
    .references(() => lot.id)
    .notNull(),
  baseAmount: integer().notNull(),
  hourlyRate: integer().notNull(),
});

export const priceRelations = relations(price, ({ one, many }) => ({
  lot: one(lot, {
    fields: [price.lotId],
    references: [lot.id],
    relationName: 'lot_prices',
  }),
  spots: many(spot, {
    relationName: 'spots_to_prices',
  }),
}));
