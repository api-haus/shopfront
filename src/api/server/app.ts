import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import autoload from '@fastify/autoload';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';

import { logger } from '../../libs/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = Fastify({
  logger,
}).withTypeProvider<TypeBoxTypeProvider>();

await app.register(
  autoload,
  {
    dir: path.join(
      __dirname,
      'plugins',
    ),
  },
);
