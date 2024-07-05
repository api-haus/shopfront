import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import {
  CachedWildberriesAdvertAPI,
} from '../../../libs/api/wildberries/accessors/CachedWildberriesAdvertAPI.js';
import {
  WildberriesAdvertAPI,
} from '../../../libs/api/wildberries/clients/WildberriesAdvertAPI.js';
import {
  testWbTokenProvider,
} from '../../../libs/test/fixtures/testWbTokenProvider.js';

declare module 'fastify' {
  interface FastifyInstance {
    wbAdvertsAPI: WildberriesAdvertAPI;
    cachedWildberriesAdvertAPI: CachedWildberriesAdvertAPI;
  }
}

export default fp(
  async function wb(app: FastifyInstance) {
    const wbAdvertsAPI = new WildberriesAdvertAPI(testWbTokenProvider);
    const cachedWildberriesAdvertAPI = new CachedWildberriesAdvertAPI(
      wbAdvertsAPI,
      app.mongo,
    );

    app.decorate(
      'wbAdvertsAPI',
      wbAdvertsAPI,
    );
    app.decorate(
      'cachedWildberriesAdvertAPI',
      cachedWildberriesAdvertAPI,
    );
  },
  {
    name: 'wb',
    dependencies: ['mongo'],
  },
);
