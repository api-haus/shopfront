import { app } from '../api/server/app.js';
import config from '../config/index.js';

// graceful shutdown
[
  'SIGINT',
  'SIGTERM',
].forEach((signal) => {
  process.on(
    signal,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async () => {
      await app.close();
      process.exit(0);
    },
  );
});

await app.listen({ ...config.server });
