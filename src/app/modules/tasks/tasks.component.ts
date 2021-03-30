import { Component } from '@angular/core';
import { UserService } from 'src/app/services/backend/user.service';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less'],
})
export class TasksComponent {
  constructor(public userService: UserService, private profileService: ProfileService) {}

  public signUp() {
    this.profileService.openRegForm$.next();
  }
}
