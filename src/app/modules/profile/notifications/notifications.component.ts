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

  constructor(private userService: UserService) {
    this.alerts = [];
  }

  ngOnInit(): void {
    if (this.userService.activeChild) {
      this.alerts = this.userService.activeChild.alerts;
    }
  }

  public ngOnDestroy() {
    if (this.alerts.length) {
      this.userService.activeChild.alerts.forEach((alert) => {
        alert.seen = true;
      });
      const seenIds: number[] = [];
      this.alerts.forEach((alert) => {
        seenIds.push(alert.id);
      });
      this.userService.setAlertsSeen(this.userService.activeChildId, seenIds).subscribe(() => {});
    }
  }
}
