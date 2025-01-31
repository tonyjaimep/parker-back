import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { FirebaseService } from 'src/firebase/firebase.service';
import { MockFirebaseService } from './firebase/firebase.mock.service';
import { UserSelect } from 'src/users/types';

export const initializeAppModule = async () =>
  Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(FirebaseService)
    .useValue(new MockFirebaseService())
    .compile();

export type Credentials = {
  user: UserSelect;
  token: string;
};
