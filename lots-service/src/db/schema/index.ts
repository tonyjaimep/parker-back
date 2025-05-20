import { currency } from './currency';
import * as lot from './lot';
import * as price from './price';

export default {
  currency,
  ...lot,
  ...price,
};
