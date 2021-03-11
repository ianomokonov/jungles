import { Child } from './child.class';

export interface User {
  id: number;
  name: string;
  surname: string;
  profilePicture?: string;
  mail: string;

  children?: Child[];
  notifications?: Notification[];
}
