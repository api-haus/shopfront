import { toDateString } from '../../../date/toDateString.js';
import type { TDateAsString } from '../../scalars/TDateAsString.js';

export interface IIdAndDates {
  id: number;
  dates: TDateAsString[]; // ['2014-01-02']
}

export class IDAndDatesArg {
  constructor(protected id: number, protected dates: Date[]) {
  }

  toRequestOptions(): IIdAndDates {
    const { id, dates } = this;

    const datesAsStrings = dates.map(date => toDateString(date));

    return {
      id,
      dates: datesAsStrings,
    };
  }
}

export const idDatesArg = (id: number, dates: Date[]): IIdAndDates => new IDAndDatesArg(
  id,
  dates,
).toRequestOptions();
