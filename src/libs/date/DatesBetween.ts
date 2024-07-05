import { addDays, differenceInDays, max, min, startOfDay } from 'date-fns';

export const DatesBetween = (dateFrom: Date, dateTo: Date): Date[] => {
  dateFrom = startOfDay(dateFrom);
  dateTo = startOfDay(dateTo);

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

  const datesBetween = [
    ...Array<Date>(Math.ceil(differenceInDays(
      dateTo,
      dateFrom,
    ))),
  ].map((_, i) => addDays(
    dateFrom,
    i,
  ));

  return datesBetween;
};
