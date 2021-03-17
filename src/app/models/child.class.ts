import { Result } from './result.class';

export interface Child {
  id: number;
  name: string;
  surname: string;
  profilePicture?: string;
  age: number;
  dateOfBirth?: Date;
  fare: number;
  leftDays: number;
  opened: boolean;

  editing: boolean;
  results?: Result[];
}
