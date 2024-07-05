import Bottleneck from 'bottleneck';
import type { RequestInfo, RequestInit } from 'undici';

const bottleneckCollection = new Map<string, Bottleneck>();
export const getBottleneck = (
  limiterOptions: Bottleneck.ConstructorOptions,
  input: RequestInfo,
  init?: RequestInit,
): Bottleneck => {
  const key = [
    input,
    init?.method,
  ].join(':');

  let bottleneck = bottleneckCollection.get(key);
  if (bottleneck) {
    return bottleneck;
  }

  bottleneck = new Bottleneck(limiterOptions);
  bottleneckCollection.set(
    key,
    bottleneck,
  );

  return bottleneck;
};
