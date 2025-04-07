import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import schema from '../schema';

export const getRandomMexicoCoordinates = () => {
  const minLat = 14.5;
  const maxLat = 32.7;
  const minLng = -118.4;
  const maxLng = -86.7;

  const lat = minLat + Math.random() * (maxLat - minLat);
  const lng = minLng + Math.random() * (maxLng - minLng);

  return { lat, lng };
};

export const truncateAllTables = async (db: NodePgDatabase<typeof schema>) => {
  const tableNames = Object.keys(db._.tableNamesMap).join(', ');
  await db.execute(`TRUNCATE TABLE ${tableNames}`);
};
