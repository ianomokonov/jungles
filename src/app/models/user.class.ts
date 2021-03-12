import { Child } from './child.class';

export interface User {
  id: number;
  name: string;
  surname: string;
  profilePicture?: string;
  email: string;

  children?: Child[];
  notifications?: Notification[];
}
