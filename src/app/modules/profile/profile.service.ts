import { Injectable } from '@angular/core';
import { Child } from '../../models/child.class';
import { User } from '../../models/user.class';

@Injectable()
export class ProfileService {
  public children: Child[] = [
    {
      id: 1,
      name: 'Алина',
      surname: 'Кравцова',
      age: 5,
      fare: 1,
      leftDays: 28,
      opened: false,
    },
    {
      id: 2,
      name: 'Ваня',
      surname: 'Кравцов',
      age: 7,
      fare: 6,
      leftDays: 2,
      opened: false,
    },
  ];
  public user: User = { id: 1, name: 'Марина', surname: 'Кравцова', email: 'mail@mail.ru' };
}
