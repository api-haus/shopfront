import { newConfig, number, string } from 'ts-app-env';

const server = {
  port: number({
    env: 'SERVER_PORT',
    default: 8080,
  }),
};
const mongo = {
  connectionUrl: string({
    env: 'MONGO_CONNECTION_URL',
  }),
};

const env = {
  server,
  mongo,
};

export default newConfig(
  env,
  process.env,
);
