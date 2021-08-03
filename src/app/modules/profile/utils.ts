import { defaultPeriod, months } from 'src/app/constants';
import { Period } from 'src/app/models/periods';

function getMonthLastDay(date: Date) {
  const result = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return result;
}

export const getPeriods = () => {
  const date = new Date();
  const periods: Period[] = [];

  for (let i = 0; i < 5; i += 1) {
    periods.push({
      label: `${months[date.getMonth()]} ${date.getFullYear()}`,
      dateFrom: new Date(date.getFullYear(), date.getMonth(), 1),
      dateTo: getMonthLastDay(date),
    });
    date.setMonth(date.getMonth() + 1);
  }

  periods.push(defaultPeriod);
  return periods;
};

export const dateToString = (date: Date): string => {
  if (!date) {
    return null;
  }
  const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  return `${year < 10 ? `0${year}` : year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
};
