import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { FirebaseService } from 'src/firebase/firebase.service';
import { MockFirebaseService } from './firebase/firebase.mock.service';
import { UserSelect } from 'src/users/types';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import schema from 'src/db/schema';
import { ValidationPipe } from '@nestjs/common';

export const initializeE2eTestApp = async () => {
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(FirebaseService)
    .useValue(new MockFirebaseService())
    .compile();

  const app = testingModule.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());

  return app;
};

export type Credentials = {
  user: UserSelect;
  token: string;
};

export const truncateAllTables = async (db: NodePgDatabase<typeof schema>) => {
  const tableNames = Object.keys(db._.tableNamesMap).join(', ');
  await db.execute(`TRUNCATE TABLE ${tableNames}`);
};
