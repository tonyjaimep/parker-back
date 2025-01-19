import { integer, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { user } from './user';
import { lot } from './lot';
import { relations } from 'drizzle-orm';

export const lotRole = pgEnum('lot_roles', ['manager', 'employee']);

export const lotsToUsers = pgTable(
  'lots_to_users',
  {
    role: lotRole(),
    userId: integer().references(() => user.id, { onDelete: 'cascade' }),
    lotId: integer().references(() => lot.id, { onDelete: 'cascade' }),
  },
  (table) => [
    {
      pk: primaryKey({ columns: [table.userId, table.lotId] }),
    },
  ],
);

export const lotsToUsersRelations = relations(lotsToUsers, ({ many }) => ({
  users: many(user, { relationName: 'lots_to_users__user' }),
  lots: many(lot, { relationName: 'lots_to_users__lot' }),
}));
