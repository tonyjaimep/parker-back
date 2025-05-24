import { currency } from './currency';
import * as lot from './lot';
import * as price from './price';
import * as spot from './spot';

export default {
  currency,
  ...lot,
  ...price,
  ...spot,
};
