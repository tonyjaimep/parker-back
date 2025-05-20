import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import schema from './schema';
import { DB_TAG } from './constants';

@Injectable()
export class DbService {
  db: NodePgDatabase<typeof schema>;

  constructor(
    @Inject(DB_TAG)
    private readonly drizzle: NodePgDatabase<typeof schema>,
  ) {
    this.db = this.drizzle;
  }
}
