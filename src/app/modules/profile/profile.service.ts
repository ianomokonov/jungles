import { Injectable } from '@angular/core';
import { Period } from 'src/app/models/periods';
import { getPeriods } from './utils';

@Injectable()
export class ProfileService {
  public periods: Period[] = [];

  constructor() {
    this.periods = getPeriods();
  }
}
