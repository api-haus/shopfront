import assert from 'node:assert';

import type { TArgsSplitter, TDataFetcher } from './BaseCachedAPI.js';

export class CachedAPIDelegateImplementation {
  argsSplitters = new Map<string, TArgsSplitter<unknown>>();
  dataFetchers = new Map<string, TDataFetcher<unknown, unknown>>();

  setArgsSplitter<TArgs>(m: string, q: TArgsSplitter<TArgs>) {
    const { argsSplitters } = this;
    argsSplitters.set(
      m,
      q as TArgsSplitter<unknown>,
    );
  }

  getArgsSplitter<TArgs>(m: string): TArgsSplitter<TArgs> {
    const { argsSplitters } = this;

    const q = argsSplitters.get(m);
    assert(q);

    return q as TArgsSplitter<TArgs>;
  }

  setDataFetcher<TArgs, TRet>(m: string, a: TDataFetcher<TArgs, TRet>) {
    const { dataFetchers } = this;
    dataFetchers.set(
      m,
      a as TDataFetcher<unknown, unknown>,
    );
  }

  getDataFetcher<TArgs, TRet>(m: string): TDataFetcher<TArgs, TRet> {
    const { dataFetchers } = this;

    const a = dataFetchers.get(m);
    assert(a);

    return a as TDataFetcher<TArgs, TRet>;
  }
}
