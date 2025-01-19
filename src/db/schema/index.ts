import { currency } from './currency';
import * as lotToUsers from './lot-to-users';
import * as user from './user';
import * as lot from './lot';
import * as spot from './spot';
import * as reservation from './reservation';
import * as price from './price';

export default {
  currency,
  ...lotToUsers,
  ...lot,
  ...price,
  ...reservation,
  ...spot,
  ...user,
};
