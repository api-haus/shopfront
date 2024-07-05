import 'dotenv/config';
import { newConfig, number, string } from 'ts-app-env';
import { MongoClientOptions } from 'mongodb';
import { FastifyListenOptions } from 'fastify/types/instance';
import { PinoLoggerOptions } from 'fastify/types/logger';

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
} as PinoLoggerOptions;

const env = {
  mongo,
  logger,
  server,
};

export default newConfig(
  env,
  process.env,
);
