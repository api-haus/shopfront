import assert from 'node:assert';

import type { MongoClient } from 'mongodb';

import config from '../config/index.js';
import {
  CachedAPIDelegateImplementation,
} from './cachedAPIDelegateImplementation.js';

export type TArgsSplitter<TArgs> = (args: TArgs) => TArgs[];
export type TDataFetcher<TArgs, TRet> = (args: TArgs) => Promise<TRet>;

export const CACHE_DB = config.mongo.databases.cache;

export interface IDocument<TArgs, TRet> {
  key: string;
  args: TArgs;
  value: TRet;
}

export interface ICacheHit<TArgs, TRet> {
  m: string;
  args: TArgs;
  value: TRet;
}

const keify = (arg: unknown): string => JSON.stringify(arg);
const findMissingArgs = <TArgs, TRet>(allArgs: TArgs[], cacheHits: ICacheHit<TArgs, TRet>[]): TArgs[] => {
  const cacheHitsByKey = cacheHits.reduce<Record<string, void>>(
    (a, v) => {
      a[keify(v.args)] = undefined;
      return a;
    },
    {},
  );

  return allArgs.filter(arg => !(keify(arg) in cacheHitsByKey));
};

export class BaseCachedAPI extends CachedAPIDelegateImplementation {
  constructor(protected mongo: MongoClient) {
    assert(mongo);
    super();
  }

  async findCachedRows<TArgs, TRet>(m: string, inputs: TArgs[]): Promise<ICacheHit<TArgs, TRet>[]> {
    const { mongo } = this;

    const documents = await mongo.db('cached_rows')
      .collection(m)
      .find({
        key: { $in: inputs.map(keify) },
      })
      .toArray();

    return documents.map((doc): ICacheHit<TArgs, TRet> => ({
      m,
      args: doc.args as TArgs,
      value: doc.value as TRet,
    }));
  }

  async cachingCall<TArgs, TRet>(m: string, args: TArgs[]): Promise<TRet[]> {
    const quantifier = this.getArgsSplitter<TArgs>(m);
    const quantizedArgs: TArgs[] = args.flatMap(a => quantifier(a));
    const cacheHits = await this.findCachedRows<TArgs, TRet>(
      m,
      quantizedArgs,
    );

    const missingArgs = findMissingArgs<TArgs, TRet>(
      quantizedArgs,
      cacheHits,
    );
    const missingRows = await this.findReal<TArgs, TRet>(
      m,
      missingArgs,
    );

    await this.saveToCache<TArgs, TRet>(
      m,
      missingArgs,
      missingRows,
    );

    return [
      ...cacheHits.map(c => c.value),
      ...missingRows,
    ];
  }

  private async findReal<TArgs, TRet>(m: string, inputs: TArgs[]): Promise<TRet[]> {
    const a = this.getDataFetcher<TArgs, TRet>(m);
    const results: TRet[] = [];

    for (const input of inputs) {
      const batch = await a(input);

      results.push(batch);
    }

    return results;
  }

  private async saveToCache<TArgs, TRet>(m: string, inputArgs: TArgs[], resultingRows: TRet[]) {
    const { mongo } = this;

    const docs: IDocument<TArgs, TRet>[] = inputArgs.map((args, i) => ({
      key: keify(args),
      args,
      value: resultingRows[i],
    }));

    if (docs.length === 0) return;

    await mongo.db(CACHE_DB)
      .collection<IDocument<TArgs, TRet>>(m)
      .insertMany(
        docs,
        {
          ordered: false,
        },
      );
  }
}
