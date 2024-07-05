import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import autoload from '@fastify/autoload';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifyPrintRoutes from 'fastify-print-routes';

import { EAppEnv } from '../../../config/EAppEnv.js';
import config from '../../../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default fp(
  async function (app: FastifyInstance) {
    if (config.env === EAppEnv.Development) {
      await app.register(fastifyPrintRoutes);
    }

    await app.register(
      autoload,
      {
        dir: path.join(
          __dirname,
          '../../endpoints',
        ),
        dirNameRoutePrefix: true,
      },
    );
  },
  {
    name: 'api-endpoints',
    dependencies: [
      'mongo',
      'wb',
    ],
  },
);
