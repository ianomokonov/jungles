import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert } from 'src/app/models/alert.class';
import { UserService } from 'src/app/services/backend/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  public alerts: Alert[];

  constructor(public userService: UserService) {
    this.alerts = [];
  }

  ngOnInit(): void {
    if (this.userService.activeChild) {
      this.alerts = this.userService.activeChild.alerts;
      const notSeenIds: number[] = [];
      this.alerts.forEach((alert) => {
        if (!alert.isSeen) {
          notSeenIds.push(alert.id);
        }
      });
      if (notSeenIds.length) {
        this.userService
          .setAlertsSeen(this.userService.activeChildId, notSeenIds)
          .subscribe(() => {});
      }
    }
  }

  public ngOnDestroy() {
    if (this.alerts.length) {
      if (this.userService.activeChild.alerts.find((alert) => alert.isSeen === false)) {
        this.userService.activeChild.alerts.forEach((alert) => {
          alert.isSeen = true;
        });
      }
    }
  }
}
