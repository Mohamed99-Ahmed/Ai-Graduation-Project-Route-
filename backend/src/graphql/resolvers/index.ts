import { databaseConnectionState } from '../../config/database.js';

export const resolvers = {
  Query: {
    health: () => `ok (database: ${databaseConnectionState()})`,
  },
};
