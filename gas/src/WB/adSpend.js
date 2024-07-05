import { httpRequest } from '../common/http_client';
import { API_PREFIX } from './constants';
/**
 * @OnlyCurrentDoc
 */
export function AdSpend() {
    const { json } = httpRequest('get', `${API_PREFIX}/adv-spend`);
    return json;
}
//# sourceMappingURL=adSpend.js.map