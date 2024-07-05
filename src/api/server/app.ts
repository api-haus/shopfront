import fastify from 'fastify';
import autoload from '@fastify/autoload';
import path from 'node:path';

export const app = fastify();

await app.register(
  autoload,
  {
    dir: path.join(
      __dirname,
      'plugins',
    ),
  },
);
