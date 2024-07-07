import { UTCDate } from '@date-fns/utc';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';

import {
  WBAdSpendByProductSKU,
} from '../../../libs/api/wildberries/aggregation/WBAdSpendByProductSKU.js';

export default async function (app: FastifyInstance) {
  app.withTypeProvider<TypeBoxTypeProvider>().route({
    method: 'GET',
    url: '/adv-spend/:rawDateFrom/:rawDateTo',
    schema: {
      params: Type.Object({
        rawDateFrom: Type.String({
          format: 'date',
        }),
        rawDateTo: Type.String({
          format: 'date',
        }),
      }),
    },
    handler: async (req) => {
      const { rawDateFrom, rawDateTo } = req.params;
      const dateFrom = new UTCDate(rawDateFrom);
      const dateTo = new UTCDate(rawDateTo);

      const wbAdSpendByProductSKU = new WBAdSpendByProductSKU(
        req.server.wbAdvertsAPI,
        req.server.cachedWildberriesAdvertAPI,
      );

      const totalRows = await wbAdSpendByProductSKU.adSpendBySKU(
        dateFrom,
        dateTo,
      );
      const rows = totalRows.map(x => x.days.map(d => d.apps.map(a => a.nm.map(n => [
        n.nmId,
        n.sum,
      ] as [number, number]))))
        .flat()
        .flat()
        .flat();

      return [
        [
          'SKU',
          'SUM',
        ],
        ...rows,
      ];
    },
  });
}
