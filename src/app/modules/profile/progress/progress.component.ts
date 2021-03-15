import { Component } from '@angular/core';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { blockAmount, tasksAmount } from 'src/app/constants';
import { Child } from 'src/app/models/child.class';
import { Period } from 'src/app/models/periods';
import { Result } from 'src/app/models/result.class';
import { UserService } from 'src/app/services/backend/user.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.less'],
})
export class ProgressComponent {
  public activeUserId: number;
  public get activeUser(): Child {
    return this.userService.user?.children?.find((child) => child.id === this.activeUserId);
  }
  public get activeChildResult(): Result {
    return this.activeUser.results.find(
      (result) =>
        result.month === this.activePeriod.month && result.year === this.activePeriod.year,
    );
  }
  public activePeriod: Period;
  public showLeftArrow = false;
  public periods: Period[] = [];

  constructor(public profileService: ProfileService, public userService: UserService) {
    if (this.userService.user.children) {
      this.activeUserId = userService.activeChild?.id
        ? userService.activeChild.id
        : this.userService.user?.children[0].id;
      this.setPeriodData();
    }
  }

  public getPercentage(amount: number, type: number): number {
    switch (type) {
      case 0:
        return (amount * 100) / blockAmount;
      default:
        return (amount * 100) / tasksAmount;
    }
  }

  public setPeriodData() {
    this.periods = [];
    this.periods = this.userService.getPeriods(this.activeUser);
    this.activePeriod = this.periods[this.periods.length - 1];
  }

  public onUserClick(id: number): void {
    this.activeUserId = id;
    this.setPeriodData();
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
