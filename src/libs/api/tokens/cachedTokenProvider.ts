import { isTokenExpired } from './isTokenExpired.js';
import type { ITokenProvider, ITokenWithExpiration } from './ITokenProvider.js';

/**
 * This token provider caches token and stuff.
 */
export const cachedTokenProvider = (inner: ITokenProvider) => {
  let cachedToken: ITokenWithExpiration | undefined;

  return async () => {
    if (cachedToken && !isTokenExpired(cachedToken)) {
      return cachedToken;
    }

    cachedToken = await inner();

    return cachedToken;
  };
};
