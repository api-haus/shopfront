import config from '../../../config/index.js';
import { constantTokenProvider } from '../../api/tokens/constantTokenProvider.js';

export const testWbTokenProvider = constantTokenProvider({
  token: config.wildberries.api.testingKey,
  type: 'Bearer',
  expiresAt: new Date(),
});
