import { FastifyInstance } from 'fastify';

export default async function (app: FastifyInstance) {
  app.route({
    method: 'GET',
    url: '/adv-spend',
    handler: () => {
      return [
        [
          'SKU',
          'Sum Adv Spend',
        ],
        [
          1234566,
          212,
        ],
      ];
    },
  });
}
