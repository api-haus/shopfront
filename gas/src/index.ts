/* eslint-disable @typescript-eslint/no-unused-vars */
import { httpRequest } from './common/http_client';
import { API_PREFIX } from './WB/constants';

/**
 * @OnlyCurrentDoc
 */
function adSpend() {
  const { json } = httpRequest(
    'get',
    `${API_PREFIX}/adv-spend`,
  );

  return json;
}
