import type { TDateAsString } from '../../scalars/TDateAsString.js';
import type { TNonNegativeInt } from '../../scalars/TNonNegativeInt.js';
import type { EWbAdvertStatus } from './EWbAdvertStatus.js';
import type { EWbAdvertType } from './EWbAdvertType.js';

export interface IWBAdvertListItem {
  advertId: TNonNegativeInt;
  changeTime: TDateAsString;
}

export interface IWBAdvertList {
  type: EWbAdvertType;
  status: EWbAdvertStatus;
  count: TNonNegativeInt;
  advert_list: IWBAdvertListItem[];
}
