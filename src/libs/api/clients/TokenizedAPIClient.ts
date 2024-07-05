import type Bottleneck from 'bottleneck';
import type { Dispatcher, RequestInfo, RequestInit } from 'undici';
import { fetch } from 'undici';

import { getBottleneck } from '../BottleneckCollection.js';
import { APIError } from '../errors/APIError.js';
import { encodeToken } from '../tokens/encodeToken.js';
import type { ITokenProvider } from '../tokens/ITokenProvider.js';

export class TokenizedAPIClient {
  constructor(protected tokenProvider: ITokenProvider, protected bottleneck?: Bottleneck, protected dispatcher?: Dispatcher) {
  }

  protected async rateLimitedCall<TData>(
    bottleneckOptions: Bottleneck.ConstructorOptions,
    input: RequestInfo,
    init?: RequestInit,
  ): Promise<TData> {
    const { bottleneck } = this;

    return this.bottleneckCall(
      getBottleneck(
        bottleneckOptions,
        input,
        init,
      ).chain(bottleneck),
      input,
      init,
    );
  }

  protected async bottleneckCall<TData>(
    bottleneck: Bottleneck,
    input: RequestInfo,
    init?: RequestInit,
  ): Promise<TData> {
    return bottleneck.schedule(() => this.call(
      input,
      init,
    ));
  }

  protected async call<TData>(
    input: RequestInfo,
    init?: RequestInit,
  ): Promise<TData> {
    const { dispatcher } = this;
    const token = await this.tokenProvider();

    const response = await fetch(
      input,
      {
        dispatcher,
        ...init,
        headers: {
          ...init?.headers,
          Authorization: encodeToken(token),
        },
      },
    );

    const { status } = response;

    if (status !== 200) {
      throw new APIError(
        status,
        await response.text(),
      );
    }

    return await response.json() as TData;
  }
}
