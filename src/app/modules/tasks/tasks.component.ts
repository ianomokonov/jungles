import { Component } from '@angular/core';
import { UserService } from 'src/app/services/backend/user.service';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less'],
})
export class TasksComponent {
  public tasks = [];
  public showBackDrop = false;
  constructor(public userService: UserService, private profileService: ProfileService) {
    this.tasks.length = 20;
    if (!this.tasks[0]?.isDone) {
      this.showBackDrop = true;
    }
  }

  public signUp() {
    this.profileService.openRegForm$.next();
  }
}
