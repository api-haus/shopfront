import {newConfig, number} from 'ts-app-env';

const server = {
  port: number({
    env: 'SERVER_PORT',
    default: 8080,
  }),
}

const env = {
  server,
};

export default newConfig(env, process.env);
