import { httpRequest } from './common/http_client';
import { API_PREFIX } from './WB/constants';

const adSpend = () => {
  const { json } = httpRequest(
    `${API_PREFIX}/adv-spend`,
    'get',
    {},
    {},
  );

  return json;
};
