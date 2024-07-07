import type { UTCDate } from '@date-fns/utc';
import {
  addDays,
  differenceInHours,
  endOfDay,
  max,
  min,
  startOfDay,
} from 'date-fns';

export const DatesBetween = (dateFrom: UTCDate, dateTo: UTCDate): UTCDate[] => {
  [
    dateFrom,
    dateTo,
  ] = [
    min([
      dateFrom,
      dateTo,
    ]) as UTCDate,
    max([
      dateFrom,
      dateTo,
    ]) as UTCDate,
  ];

  dateFrom = startOfDay(dateFrom);
  dateTo = endOfDay(dateTo);

  const datesBetween = [
    ...Array<UTCDate>(Math.ceil(differenceInHours(
      dateTo,
      dateFrom,
    ) / 24)),
  ].map((_, i) => addDays(
    dateFrom,
    i,
  ));

  return datesBetween;
};
