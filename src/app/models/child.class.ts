import { Alert } from './alert.class';
import { Result } from './result.class';

export interface Child {
  id: number;
  name: string;
  surname: string;
  image?: string;
  age: number;
  dateOfBirth?: Date;
  fare: number;
  leftDays: number;
  opened: boolean;

  editing: boolean;
  results?: Result[];
  alerts?: Alert[];
}
