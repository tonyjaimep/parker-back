import { pgEnum } from 'drizzle-orm/pg-core';

export const currency = pgEnum('currency', ['mxn', 'usd']);
