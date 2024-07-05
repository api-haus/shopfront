import { httpRequest } from '../common/http_client';
import { API_PREFIX } from './constants';

/**
 * @OnlyCurrentDoc
 */
export function AdSpend(dateFrom: string, dateTo: string) {
  const { json } = httpRequest(
    'get',
    `${API_PREFIX}/adv-spend/${dateFrom}/${dateTo}`,
  );

  return json;
}
