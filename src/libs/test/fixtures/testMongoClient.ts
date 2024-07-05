import { MongoClient } from 'mongodb';

import config from '../../../config/index.js';

export const testMongoClient = new MongoClient(
  config.mongo.connectionUrl,
  config.mongo.options,
);
