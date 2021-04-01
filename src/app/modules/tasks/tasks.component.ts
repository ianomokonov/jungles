import { Component } from '@angular/core';
import { TasksInfo } from 'src/app/models/tasks-info';
import { TaskService } from 'src/app/services/backend/task.service';
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
  public info: TasksInfo;
  constructor(
    public userService: UserService,
    private profileService: ProfileService,
    private tasksService: TaskService,
  ) {
    this.tasks.length = 20;
    if (!this.tasks[0]?.isDone) {
      this.showBackDrop = true;
    }

    this.tasksService.getTasksInfo(userService.activeChild?.id).subscribe((info) => {
      this.info = info;
    });
  }

  public signUp() {
    this.profileService.openRegForm$.next();
  }
}
