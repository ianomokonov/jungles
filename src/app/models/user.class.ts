import { Child } from './child.class';

export class User {
  public id: number;
  public name: string;
  public surname: string;
  public image?: string;
  public email: string;

  public children?: Child[];
  public notifications?: Notification[];
}