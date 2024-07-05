export interface ITokenWithExpiration {
  type: 'Bearer' | undefined;
  token: string;
  expiresAt: Date;
}

export type ITokenProvider = () => Promise<ITokenWithExpiration>;
