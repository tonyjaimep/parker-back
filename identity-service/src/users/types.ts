import { user } from 'src/db/schema/user';

export type UserSelect = typeof user.$inferSelect;

export type UserInsert = typeof user.$inferInsert;

export type UserEditableFields = Pick<UserSelect, 'fullName' | 'displayName'>;
