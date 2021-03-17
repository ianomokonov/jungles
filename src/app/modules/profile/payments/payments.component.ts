import { Component, OnDestroy } from '@angular/core';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { defaultPeriod } from 'src/app/constants';
import { Child } from 'src/app/models/child.class';
import { Period } from 'src/app/models/periods';
import { UserService } from 'src/app/services/backend/user.service';
import { Payment } from '../../../models/payment';
import { ProfileService } from '../profile.service';
import { getPeriods } from '../utils';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.less'],
})
export class PaymentsComponent implements OnDestroy {
  private rxAlive = true;
  public activeUserId: number;
  public get activeUser(): Child {
    return this.userService.user?.children?.find((child) => child.id === this.activeUserId);
  }
  public activePeriod: Period;
  public periods: Period[] = [];
  public showLeftArrow = false;
  public showRightArrow = true;
  public payments: Payment[];

  constructor(public profileService: ProfileService, public userService: UserService) {
    if (this.userService.user.children?.length) {
      this.activeUserId = userService.user.children[0]?.id;
      this.periods = getPeriods();
      this.onPeriodChange();
    }
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public onPeriodChange(period?: Period) {
    this.userService
      .getChildPayments(this.activeUserId, period?.dateFrom, period?.dateTo)
      .subscribe((payments) => {
        this.payments = payments;
      });
    this.activePeriod = period || defaultPeriod;
  }

  public onUserClick(id: number): void {
    this.activeUserId = id;
    this.onPeriodChange();
  }

  public getFormattedSum(sum: number): string {
    return new Intl.NumberFormat('ru-RU').format(sum);
  }

  public onSlide(event: NgbSlideEvent) {
    this.onUserClick(this.userService.user?.children[+event.current].id);
    if (+event.current === 0) {
      this.showRightArrow = true;
      this.showLeftArrow = false;
      return;
    }
    this.showRightArrow = false;
    this.showLeftArrow = true;
  }
}
