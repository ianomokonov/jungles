import { Period } from './models/periods';

export const refreshTokenKey = 'refreshToken';
export const userTokenKey = 'userToken';
export const activeChildKey = 'activeChildId';
export const invalidTokenError = 'Invalid Token';

export const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const defaultPeriod: Period = { label: 'За всё время' };

// Временные значения количества и количества заданий (всего)
export const blockAmount = 6;
export const tasksAmount = 40;

export const tasksPerPage = 20;
