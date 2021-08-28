import { Component, OnDestroy, OnInit } from '@angular/core';
import { asyncScheduler, forkJoin, Observable, scheduled } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { Task } from 'src/app/models/task';
import { TasksInfo } from 'src/app/models/tasks-info';
import { TaskService } from 'src/app/services/backend/task.service';
import { TokenService } from 'src/app/services/backend/token.service';
import { UserService } from 'src/app/services/backend/user.service';
import { LoadingService } from 'src/app/services/loading.service';
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
  public canGetNextTasks = false;
  private rxAlive = true;
  constructor(
    public userService: UserService,
    private profileService: ProfileService,
    private tasksService: TaskService,
    private tokenService: TokenService,
    public loadingService: LoadingService,
  ) {}
  public ngOnDestroy() {
    this.rxAlive = false;
  }
  public ngOnInit() {
    if (this.tokenService.getAuthToken()) {
      const subscription = this.userService.userLoaded$
        .pipe(
          takeWhile(() => this.rxAlive),
          switchMap((user) =>
            user ? scheduled([user], asyncScheduler) : this.userService.getUserInfo(),
          ),
        )
        .subscribe((user) => {
          this.loadingService.removeSubscription(subscription);
          if (!user) {
            return;
          }
          this.initTasks();
        });
      this.loadingService.addSubscription(subscription);
      return;
    }
    this.initTasks();
  }

  public initTasks() {
    const subscription = forkJoin(this.getTaskRequests()).subscribe(([info, tasks]) => {
      this.info = info;
      this.tasks = tasks;
      this.setActive(this.tasks);
      const solvedTasks = this.tasks.filter((t) => t.allSolved);
      if (solvedTasks?.length) {
        this.setCanGetNextTasks(solvedTasks[solvedTasks.length - 1].number + 1);
      }
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
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

  public getNextTasks() {
    if (!this.canGetNextTasks) {
      return;
    }

    this.userService.addChest(this.userService.activeChild.id).subscribe(() => {
      this.tasksService.getTasksInfo(this.userService.activeChild.id).subscribe((info) => {
        this.info = info;
      });
    });

    this.tasksService
      .getTasks(this.userService.activeChild.id, this.tasks?.length, 20)
      .subscribe((tasks) => {
        if (!this.tasks.find((t) => t.isActive)) {
          if (tasks?.length) {
            // eslint-disable-next-line no-param-reassign
            tasks[0].isActive = true;
            this.setCanGetNextTasks(tasks[0].number);
          }
        }
        this.setCanGetNextTasks(1);
        this.tasks.push(...tasks);
      });
  }

  private setCanGetNextTasks(activeNumber: number) {
    this.canGetNextTasks = (activeNumber - 1) % 20 === 19;
  }
}
