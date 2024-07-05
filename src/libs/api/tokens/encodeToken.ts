import type { ITokenWithExpiration } from './ITokenProvider.js';

export const encodeToken = (nonExpiredToken: ITokenWithExpiration) => {
  const { type, token } = nonExpiredToken;

  if (type) {
    return `${type} ${token}`;
  }

  return token;
};
