import { MongoClient } from 'mongodb';
import { FastifyInstance } from 'fastify';
import config from '../../../config/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    mongo: MongoClient;
  }
}

export default async function (app: FastifyInstance) {
  const client = new MongoClient(
    config.mongo.connectionUrl,
    config.mongo.options,
  );

  await client.connect();

  app.decorate(
    'mongo',
    client,
  );
}
