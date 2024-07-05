import { batchSplit } from '../../../batching/batchSplit.js';
import { DatesBetween } from '../../../date/DatesBetween.js';
import { Pause } from '../../../Pause.js';
import type {
  CachedWildberriesAdvertAPI,
} from '../accessors/CachedWildberriesAdvertAPI.js';
import type { WildberriesAdvertAPI } from '../clients/WildberriesAdvertAPI.js';
import { idDatesArg } from '../params/IDAndDatesArg.js';
import type { IWBPromotionFullStats } from '../types/IWBPromotionFullStats.js';

export class WBAdSpendByProductSKU {
  constructor(protected wbAdvertsAPI: WildberriesAdvertAPI, protected cachedWbAdvertsAPI: CachedWildberriesAdvertAPI) {
  }

  async adSpendBySKU(dateFrom: Date, dateTo: Date) {
    const { wbAdvertsAPI, cachedWbAdvertsAPI } = this;

    const { adverts } = await wbAdvertsAPI.groupedPromotionCounts();
    const advertIDs = adverts.flatMap((av) => {
      return av.advert_list.map(av => av.advertId);
    });

    const datesBetween = DatesBetween(
      dateFrom,
      dateTo,
    );
    const batchesBy5Days = batchSplit(
      datesBetween,
      5,
    );
    const batchesBy100AdIds = batchSplit(
      advertIDs,
      100,
    );

    const batchesOf100IdsAnd5Dates = batchesBy100AdIds.flatMap((hundredIds) => {
      return hundredIds.map((id) => {
        return batchesBy5Days.map(fiveDates => idDatesArg(
          id,
          fiveDates,
        ));
      });
    });

    const allPromotionStats: IWBPromotionFullStats[] = [];

    for (const batchArgs of batchesOf100IdsAnd5Dates) {
      const weight = batchArgs.reduce(
        (a, v) => a + v.dates.length,
        0,
      );

      const batch = await cachedWbAdvertsAPI.promotionFullStats(batchArgs);
      allPromotionStats.push(...batch);

      await Pause(weight * 10_000);
    }

    return allPromotionStats;
  }
}
