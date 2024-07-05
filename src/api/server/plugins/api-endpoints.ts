import { FastifyInstance } from 'fastify';
import autoload from '@fastify/autoload';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyPrintRoutes from 'fastify-print-routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function (app: FastifyInstance) {
  await app.register(fastifyPrintRoutes);
  await app.register(
    autoload,
    {
      dir: path.join(
        __dirname,
        '../../endpoints',
      ),
      dirNameRoutePrefix: true,
    },
  );
}
