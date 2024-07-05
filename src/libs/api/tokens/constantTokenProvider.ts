import type { ITokenProvider, ITokenWithExpiration } from './ITokenProvider.js';

export const constantTokenProvider = (token: ITokenWithExpiration): ITokenProvider => async () => token;
