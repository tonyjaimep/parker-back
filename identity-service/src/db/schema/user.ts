import { sql } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

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
