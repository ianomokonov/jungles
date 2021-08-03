import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Period } from 'src/app/models/periods';
import { getPeriods } from './utils';

@Injectable()
export class ProfileService {
  public periods: Period[] = [];
  public openRegForm$: Subject<void> = new Subject();

  constructor() {
    this.periods = getPeriods();
  }
}
