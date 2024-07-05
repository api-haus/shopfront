import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { MongoClient } from 'mongodb';

import config from '../../../config/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    mongo: MongoClient;
  }
}

export default fp(
  async function (app: FastifyInstance) {
    const client = new MongoClient(
      config.mongo.connectionUrl,
      config.mongo.options,
    );

    await client.connect();

    app.decorate(
      'mongo',
      client,
    );
  },
  { name: 'mongo' },
);
