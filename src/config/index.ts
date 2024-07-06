import 'dotenv/config';

import { type FastifyListenOptions } from 'fastify';
import type { MongoClientOptions } from 'mongodb';
import { type LoggerOptions } from 'pino';
import { newConfig, number, option, string } from 'ts-app-env';
import type { RetryHandler } from 'undici';

import { EAppEnv } from './EAppEnv.js';

const env = option<EAppEnv>(
  {
    env: 'NODE_ENV',
    default: EAppEnv.Development,
  },
  s => s as EAppEnv,
);

const server = {
  port: number({
    env: 'SERVER_PORT',
    default: 8080,
  }),
  host: string({
    env: 'SERVER_HOST',
    default: '0.0.0.0',
  }),
} as FastifyListenOptions;
const mongo = {
  connectionUrl: string({
    env: 'MONGO_CONNECTION_URL',
  }),
  options: {} as MongoClientOptions,
  databases: {
    cache: 'cached_rows',
  },
};
const logger = {
  level: string({
    env: 'LOG_LEVEL',
    default: 'trace',
  }),
  name: string({
    env: 'APP_NAME',
    default: 'sf-api',
  }),
} as LoggerOptions;
const wildberries = {
  api: {
    testingKey: string({
      env: 'WB_TESTING_KEY',
      default: '',
    }),
    retryOptions: {
      maxRetries: 15,
      minTimeout: 30_000,
      maxTimeout: 600_000,
      retryAfter: true,
      timeoutFactor: 1.5,
    } as RetryHandler.RetryOptions,
  },
};

const app = {
  env,
  mongo,
  logger,
  server,
  wildberries,
};

export default newConfig(
  app,
  process.env,
);
