import { Component } from '@angular/core';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { blockAmount, defaultPeriod, tasksAmount } from 'src/app/constants';
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
  public activeChildResult: Result;
  public activePeriod: Period;
  public showLeftArrow = false;
  public showRightArrow = true;

  constructor(public profileService: ProfileService, public userService: UserService) {
    if (this.userService.user?.children?.length) {
      this.activeUserId = userService.activeChild?.id
        ? userService.activeChild.id
        : this.userService.user?.children[0]?.id;
      this.onPeriodChange();
    }
  }

  public onPeriodChange(period?: Period) {
    this.userService
      .getProgress(this.activeUserId, period?.dateFrom, period?.dateTo)
      .subscribe((result) => {
        this.activeChildResult = result;
      });
    this.activePeriod = period || defaultPeriod;
  }

  public getPercentage(amount: number, type: number): number {
    switch (type) {
      case 0:
        return (amount * 100) / blockAmount;
      default:
        return (amount * 100) / tasksAmount;
    }
  }

  public onUserClick(id: number): void {
    this.activeUserId = id;
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
