import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { userTasksKey } from 'src/app/constants';
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
        forkJoin([
          this.tasksService.getTasksInfo(this.userService.activeChild.id),
          this.tasksService.getTasks(this.userService.activeChild.id),
        ]).subscribe(([info, tasks]) => {
          this.info = info;
          this.tasks = tasks;
          this.tasks = this.tasksSort(this.tasks);
        });
      });
    } else {
      this.info = this.tasksService.getUnregTasksInfo();
      if (!JSON.parse(sessionStorage.getItem(userTasksKey))) {
        this.tasksService
          .getUnregTasks()
          .pipe(takeWhile(() => this.rxAlive))
          .subscribe((tasks) => {
            this.tasks = tasks;
            this.tasks = this.tasksSort(this.tasks);
            sessionStorage.setItem(userTasksKey, JSON.stringify(this.tasks));
          });
      } else {
        this.tasks = JSON.parse(sessionStorage.getItem(userTasksKey));
        this.tasks = this.tasksSort(this.tasks);
        sessionStorage.setItem(userTasksKey, JSON.stringify(this.tasks));
      }
    }
  }

  public tasksSort(tasks: Task[]): Task[] {
    let activeFound = false;
    if (tasks) {
      tasks.forEach((taskTemp) => {
        const task = taskTemp;
        task.isSolved = !task.questions?.some((question) => {
          if (!question.childAnswers?.length) {
            return true;
          }
          return question.childAnswers.some(
            (answer) => !answer.isCorrect && !answer.isCorrectVariant,
          );
        });
        if (!activeFound && !task.isSolved) {
          task.isActive = true;
          activeFound = true;
        }
      });
      if (!tasks[0]?.isSolved) {
        this.showBackDrop = true;
      }
    }
    return tasks;
  }

  public signUp() {
    this.profileService.openRegForm$.next();
  }
}
