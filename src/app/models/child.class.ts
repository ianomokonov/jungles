import { Result } from './result.class';

export interface Child {
  id: number;
  name: string;
  surname: string;
  profilePicture?: string;
  age: number;
  fare: number;
  leftDays: number;
  opened: boolean;
  active?: boolean;

  results?: Result[];
}
