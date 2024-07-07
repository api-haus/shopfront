import { UTCDate } from '@date-fns/utc';
import { expect, test } from '@jest/globals';

import { testAdvertIds } from '../../../test/fixtures/advertIDs.js';
import { testMongoClient } from '../../../test/fixtures/testMongoClient.js';
import {
  testWbTokenProvider,
} from '../../../test/fixtures/testWbTokenProvider.js';
import { WildberriesAdvertAPI } from '../clients/WildberriesAdvertAPI.js';
import { idDatesArg } from '../params/IDAndDatesArg.js';
import { CachedWildberriesAdvertAPI } from './CachedWildberriesAdvertAPI.js';

test(
  'Thingy',
  async () => {
    const wbAdvertsAPI = new WildberriesAdvertAPI(testWbTokenProvider);
    const p = new CachedWildberriesAdvertAPI(
      wbAdvertsAPI,
      testMongoClient,
    );

    const allStats = await p.promotionFullStats([
      idDatesArg(
        testAdvertIds[45],
        [new UTCDate('2024-06-21')],
      ),
    ]);

    expect(allStats).toMatchSnapshot();
  },
);
