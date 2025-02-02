import { IsNumber } from 'class-validator';
import { lot } from 'src/db/schema/lot';

export type LotInsert = typeof lot.$inferInsert;
export type LotSelect = typeof lot.$inferSelect;

export class Coordinates {
  @IsNumber()
  latitude: number;
  @IsNumber()
  longitude: number;
}

export type LotEditableFields = Pick<LotInsert, 'address' | 'name'> & {
  location: Coordinates;
};
