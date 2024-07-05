import type { MongoClient } from 'mongodb';

import { BaseCachedAPI, CACHE_DB } from '../../../BaseCachedAPI.js';
import type { WildberriesAdvertAPI } from '../clients/WildberriesAdvertAPI.js';
import type { IIdAndDates } from '../params/IDAndDatesArg.js';
import type { IWBPromotionFullStats } from '../types/IWBPromotionFullStats.js';

const splitIdsAndDates = (args: IIdAndDates): IIdAndDates[] => {
  const splitArgs: IIdAndDates[] = [];
  const { dates = [], id } = args;

  for (const date of dates) {
    splitArgs.push({
      id,
      dates: [date],
    });
  }

  return splitArgs;
};

export class CachedWildberriesAdvertAPI extends BaseCachedAPI {
  constructor(protected inner: WildberriesAdvertAPI, protected mongo: MongoClient) {
    super(mongo);

    this.setArgsSplitter<IIdAndDates>(
      this.promotionFullStats.name,
      splitIdsAndDates,
    );
    this.setDataFetcher<IIdAndDates, IWBPromotionFullStats[]>(
      this.promotionFullStats.name,
      args => this.inner.promotionFullStats([args]),
    );

    void this.ensureIndexes();
  }

  async ensureIndexes() {
    await this.mongo.db(CACHE_DB).collection(this.promotionFullStats.name)
      .createIndex(
        {
          key: 1,
        },
        {
          unique: true,
          sparse: false,
        },
      );
  }

  async promotionFullStats(idsAndDates: IIdAndDates[]): Promise<IWBPromotionFullStats[]> {
    const allResults = await this.cachingCall<IIdAndDates, IWBPromotionFullStats[]>(
      this.promotionFullStats.name,
      idsAndDates,
    );

    return allResults.flat();
  }
}
