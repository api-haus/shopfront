import pino from 'pino';
import config from '../config/index.js';

export const logger = pino(config.logger);
