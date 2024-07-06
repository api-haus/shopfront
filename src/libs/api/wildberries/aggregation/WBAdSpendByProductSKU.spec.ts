import { expect, test } from '@jest/globals';
import { setupRecorder } from 'nock-record';

import { testMongoClient } from '../../../test/fixtures/testMongoClient.js';
import {
  testWbTokenProvider,
} from '../../../test/fixtures/testWbTokenProvider.js';
import {
  CachedWildberriesAdvertAPI,
} from '../accessors/CachedWildberriesAdvertAPI.js';
import { WildberriesAdvertAPI } from '../clients/WildberriesAdvertAPI.js';
import { WBAdSpendByProductSKU } from './WBAdSpendByProductSKU.js';

const record = setupRecorder();

test(
  'same dates',
  async () => {
    const { completeRecording, assertScopesFinished } = await record('__WBAdSpendByProductSKU');

    const wbAdvertsAPI = new WildberriesAdvertAPI(testWbTokenProvider);
    const cachedWildberriesAdvertAPI = new CachedWildberriesAdvertAPI(
      wbAdvertsAPI,
      testMongoClient,
    );
    const wbAdSpendByProductSKU = new WBAdSpendByProductSKU(
      wbAdvertsAPI,
      cachedWildberriesAdvertAPI,
    );

    const dateFrom = new Date('2024-06-21');
    const dateTo = new Date('2024-06-21');

    const totalRows = await wbAdSpendByProductSKU.adSpendBySKU(
      dateFrom,
      dateTo,
    );

    completeRecording();
    assertScopesFinished();

    expect(totalRows).toMatchSnapshot();
  },
  2_000_000,
);

test(
  'WBAdSpendByProductSKU',
  async () => {
    const { completeRecording, assertScopesFinished } = await record('__WBAdSpendByProductSKU');

    const wbAdvertsAPI = new WildberriesAdvertAPI(testWbTokenProvider);
    const cachedWildberriesAdvertAPI = new CachedWildberriesAdvertAPI(
      wbAdvertsAPI,
      testMongoClient,
    );
    const wbAdSpendByProductSKU = new WBAdSpendByProductSKU(
      wbAdvertsAPI,
      cachedWildberriesAdvertAPI,
    );

    const dateFrom = new Date('2024-06-21');
    const dateTo = new Date('2024-06-22');

    const totalRows = await wbAdSpendByProductSKU.adSpendBySKU(
      dateFrom,
      dateTo,
    );

    completeRecording();
    assertScopesFinished();

    expect(totalRows).toMatchSnapshot();
  },
  2_000_000,
);
