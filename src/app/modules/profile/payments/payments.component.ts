import { Component, OnDestroy } from '@angular/core';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { takeWhile } from 'rxjs/operators';
import { Child } from 'src/app/models/child.class';
import { Period } from 'src/app/models/periods';
import { UserService } from 'src/app/services/backend/user.service';
import { Payment } from '../../../models/payment';
import { ProfileService } from '../profile.service';

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
  public get activePeriodPayments(): Payment[] {
    const selectedPayments: Payment[] = [];
    this.payments.forEach((payment) => {
      if (payment.month === this.activePeriod.month && payment.year === this.activePeriod.year) {
        selectedPayments.push(payment);
      }
    });
    return selectedPayments;
  }
  public periods: Period[] = [];
  public showLeftArrow = false;
  public payments: Payment[];

  constructor(public profileService: ProfileService, public userService: UserService) {
    if (this.userService.user.children) {
      this.activeUserId = userService.user.children[0]?.id;
      this.setPeriodData();
      this.getChildPayments();
    }
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public setPeriodData(): void {
    this.periods = [];
    this.periods = this.userService.getPeriods(this.activeUser);
    this.activePeriod = this.periods[this.periods.length - 1];
  }

  public getChildPayments() {
    this.userService
      .getChildPayments(this.activeUserId)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((data: Payment[]) => {
        if (data) {
          this.payments = data;
        }
      });
  }

  public onUserClick(id: number): void {
    this.activeUserId = id;
    this.setPeriodData();
    this.getChildPayments();
  }

  public getFormattedSum(sum: number): string {
    return new Intl.NumberFormat('ru-RU').format(sum);
  }

  public onSlide(event: NgbSlideEvent) {
    this.onUserClick(this.profileService.children[+event.current].id);
    if (+event.current === 0) {
      this.showLeftArrow = false;
      return;
    }

    this.showLeftArrow = true;
  }
}
