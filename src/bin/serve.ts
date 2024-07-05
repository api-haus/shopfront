import { app } from '../api/server/app.js';
import config from '../config/index.js';

await app.listen({ ...config.server });
