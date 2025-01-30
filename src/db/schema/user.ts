import { relations, sql } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { lotsToUsers } from './lot-to-users';

export const user = pgTable('users', {
  id: serial().primaryKey(),
  firebaseUserId: varchar().notNull().unique(),
  fullName: varchar().notNull(),
  displayName: varchar().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const userRelations = relations(user, ({ many }) => ({
  lotsToUsers: many(lotsToUsers, { relationName: 'lots_to_users__user' }),
}));
