import { app } from '../api/server/app.js';
import config from '../config/index.js';

app.listen(
  { ...config.server },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);
