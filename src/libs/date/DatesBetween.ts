import {
  addDays,
  differenceInHours,
  endOfDay,
  max,
  min,
  startOfDay,
} from 'date-fns';

export const DatesBetween = (dateFrom: Date, dateTo: Date): Date[] => {
  [
    dateFrom,
    dateTo,
  ] = [
    min([
      dateFrom,
      dateTo,
    ]),
    max([
      dateFrom,
      dateTo,
    ]),
  ];

  dateFrom = startOfDay(dateFrom);
  dateTo = endOfDay(dateTo);

  const datesBetween = [
    ...Array<Date>(Math.ceil(differenceInHours(
      dateTo,
      dateFrom,
    ) / 24)),
  ].map((_, i) => addDays(
    dateFrom,
    i,
  ));

  return datesBetween;
};
