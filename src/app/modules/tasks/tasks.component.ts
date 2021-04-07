import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Task } from 'src/app/models/task';
import { TasksInfo } from 'src/app/models/tasks-info';
import { TaskService } from 'src/app/services/backend/task.service';
import { TokenService } from 'src/app/services/backend/token.service';
import { UserService } from 'src/app/services/backend/user.service';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less'],
})
export class TasksComponent implements OnInit, OnDestroy {
  public tasks: Task[] = [];
  public showBackDrop = false;
  public info: TasksInfo;
  private rxAlive = true;
  constructor(
    public userService: UserService,
    private profileService: ProfileService,
    private tasksService: TaskService,
    private tokenService: TokenService,
  ) {}
  public ngOnDestroy() {
    this.rxAlive = false;
  }
  public ngOnInit() {
    if (this.tokenService.getAuthToken()) {
      this.userService.userLoaded$.pipe(takeWhile(() => this.rxAlive)).subscribe((user) => {
        if (!user) {
          return;
        }
        this.initTasks();
      });
      return;
    }
    this.initTasks();
  }

  public initTasks() {
    forkJoin(this.getTaskRequests()).subscribe(([info, tasks]) => {
      this.info = info;
      this.tasks = tasks;
      this.setActive(this.tasks);
    });
  }

  private getTaskRequests(): [Observable<TasksInfo>, Observable<Task[]>] {
    if (this.userService.activeChild?.id) {
      return [
        this.tasksService.getTasksInfo(this.userService.activeChild.id),
        this.tasksService.getTasks(this.userService.activeChild.id),
      ];
    }

    return [this.tasksService.getUnregTasksInfo(), this.tasksService.getUnregTasks()];
  }

  public setActive(tasks: Task[]): void {
    let activeFound = false;
    if (tasks) {
      tasks.forEach((taskTemp) => {
        const task = taskTemp;
        if (!activeFound && !task.allSolved) {
          task.isActive = true;
          activeFound = true;
        }
      });
      if (!tasks[0]?.allSolved) {
        this.showBackDrop = true;
      }
    }
  }

  public signUp() {
    this.profileService.openRegForm$.next();
  }
}
