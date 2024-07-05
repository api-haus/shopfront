import fastify from 'fastify';
import autoload from '@fastify/autoload';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '../../libs/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = fastify({
  logger,
});

await app.register(
  autoload,
  {
    dir: path.join(
      __dirname,
      'plugins',
    ),
  },
);
