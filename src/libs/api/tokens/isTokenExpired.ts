import type { ITokenWithExpiration } from './ITokenProvider.js';

export const isTokenExpired = (

  /**
   * Actual token that we have.
   */
  cachedToken: ITokenWithExpiration,

  /**
   * Now is the time.
   */
  now = new Date(),

  /**
   * How much time to have in advance, so we don't use the token when it's going to expire in a microsecond.
   */
  laziness = 5_000,
) => {
  const { expiresAt = new Date() } = cachedToken;
  const lazyTime = new Date(+now - laziness);
  return expiresAt <= lazyTime;
};
