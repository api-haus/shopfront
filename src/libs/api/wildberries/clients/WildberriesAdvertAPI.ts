import { constants } from 'node:http2';

import Bottleneck from 'bottleneck';
import { Client, interceptors } from 'undici';

import config from '../../../../config/index.js';
import { TokenizedAPIClient } from '../../clients/TokenizedAPIClient.js';
import { retryHandler } from '../../common/RetryHandler.js';
import type { IIdAndDates } from '../params/IDAndDatesArg.js';
import type { IPromotionAdvertsInfo } from '../types/IPromotionAdvertsInfo.js';
import type { IWBAdvertList } from '../types/IWBAdvertList.js';
import type { IWBPromotionFullStats } from '../types/IWBPromotionFullStats.js';

export const CPrefixAdvertAPIV1 = 'https://advert-api.wildberries.ru/adv/v1';
export const CPrefixAdvertAPIV2 = 'https://advert-api.wildberries.ru/adv/v2';

export class WildberriesAdvertAPI extends TokenizedAPIClient {
  bottleneck = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1000 / 3,
  });

  dispatcher = new Client(
    'https://advert-api.wildberries.ru',
    {
      strictContentLength: false,
    },
  )
    .compose(interceptors.retry({
      ...config.wildberries.api.retryOptions,
      retry: retryHandler,
      errorCodes: [
        'ECONNRESET',
        'ECONNREFUSED',
        'ENOTFOUND',
        'ENETDOWN',
        'ENETUNREACH',
        'EHOSTDOWN',
        'EHOSTUNREACH',
        'EPIPE',
        'UND_ERR_SOCKET',
        'UND_ERR_REQ_CONTENT_LENGTH_MISMATCH',
      ],
      methods: [
        'GET',
        'HEAD',
        'POST',
        'OPTIONS',
        'PUT',
        'DELETE',
        'TRACE',
      ],
      statusCodes: [
        500,
        502,
        503,
        504,
        429,
      ],
    }));

  async groupedPromotionCounts(): Promise<{ adverts: IWBAdvertList[] }> {
    return this.rateLimitedCall<{ adverts: IWBAdvertList[] }>(
      {
        maxConcurrent: 1,
        minTime: 1000 / 5 + 100, // max 5 rps
      },
      `${CPrefixAdvertAPIV1}/promotion/count`,
      {
        method: 'GET',
      },
    );
  }

  async promotionFullStats(idsAndDates: IIdAndDates[]): Promise<IWBPromotionFullStats[]> {
    return this.rateLimitedCall<IWBPromotionFullStats[]>(
      {
        maxConcurrent: 1,
        minTime: 30000, // max 5 rps
      },
      `${CPrefixAdvertAPIV2}/fullstats`,
      {
        method: 'POST',
        headers: {
          [constants.HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
        },
        body: JSON.stringify(idsAndDates),
      },
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ).then(res => (res ?? [])) // WB kink (it will return null 🙄)
      .catch((err: unknown) => {
        if ((err as Error).message.includes('нет кампаний')) {
          return [];
        }
        throw err;
      });
  }

  async promotionAdvertsInfo(advertIds: number[]): Promise<IPromotionAdvertsInfo> {
    return this.rateLimitedCall<IPromotionAdvertsInfo>(
      {
        maxConcurrent: 1,
        minTime: 1000 / 5 + 100, // max 5 rps
      },
      `${CPrefixAdvertAPIV1}/promotion/adverts`,
      {
        method: 'POST',
        headers: {
          [constants.HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
        },
        body: JSON.stringify(advertIds),
      },
    );
  }
}
