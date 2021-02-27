import { Injectable } from '@angular/core';
import { Child } from './models/child.class';

@Injectable()
export class ProfileService {
  public children: Child[] = [
    { id: 1, name: 'Алина', surname: 'Кравцова', age: 5, fare: 1, leftDays: 28, opened: false },
  ];
}
