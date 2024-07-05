import { FastifyInstance } from 'fastify';

export default function (app: FastifyInstance) {
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
