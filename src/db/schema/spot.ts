import { relations, sql } from 'drizzle-orm';
import {
  serial,
  boolean,
  integer,
  pgTable,
  timestamp,
} from 'drizzle-orm/pg-core';
import { lot } from './lot';
import { price } from './price';

export const spot = pgTable('spots', {
  id: serial().primaryKey(),
  lotId: integer()
    .references(() => lot.id, { onDelete: 'cascade' })
    .notNull(),
  priceId: integer().references(() => price.id, { onDelete: 'set null' }),
  isAvailable: boolean().default(true),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const spotRelations = relations(spot, ({ one }) => ({
  lot: one(lot, {
    relationName: 'lot_to_spots',
    fields: [spot.lotId],
    references: [lot.id],
  }),
  spotToPrice: one(price, {
    relationName: 'spots_to_prices',
    fields: [spot.priceId],
    references: [price.id],
  }),
}));
