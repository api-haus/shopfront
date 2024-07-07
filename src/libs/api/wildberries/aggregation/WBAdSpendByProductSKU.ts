import type { UTCDate } from '@date-fns/utc';

import { DatesBetween } from '../../../date/DatesBetween.js';
import type {
  CachedWildberriesAdvertAPI,
} from '../accessors/CachedWildberriesAdvertAPI.js';
import type { WildberriesAdvertAPI } from '../clients/WildberriesAdvertAPI.js';
import { idDatesArg } from '../params/IDAndDatesArg.js';

export class WBAdSpendByProductSKU {
  constructor(protected wbAdvertsAPI: WildberriesAdvertAPI, protected cachedWbAdvertsAPI: CachedWildberriesAdvertAPI) {
  }

  async adSpendBySKU(dateFrom: UTCDate, dateTo: UTCDate) {
    const { wbAdvertsAPI, cachedWbAdvertsAPI } = this;

    const { adverts } = await wbAdvertsAPI.groupedPromotionCounts();
    const advertIDs = adverts.flatMap((av) => {
      return av.advert_list.map(av => av.advertId);
    });
    advertIDs.sort();

    const datesBetween = DatesBetween(
      dateFrom,
      dateTo,
    );

    const allInputs = datesBetween.flatMap((date) => {
      return advertIDs.map((id) => {
        return idDatesArg(
          id,
          [date],
        );
      });
    });

    const allPromotionStats = await cachedWbAdvertsAPI.promotionFullStats(allInputs);

    return allPromotionStats;
  }
}
