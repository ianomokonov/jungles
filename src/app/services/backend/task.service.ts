import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tasksPerPage, userTasksInfoKey } from 'src/app/constants';
import { Task } from 'src/app/models/task';
import { TasksInfo } from 'src/app/models/tasks-info';
import { environment } from 'src/environments/environment';

@Injectable()
export class TaskService {
  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  public getTasksInfo(childId: number): Observable<TasksInfo> {
    return this.http.get<TasksInfo>(`${this.baseUrl}/child/${childId}/tasks/get-tasks-info`);
  }

  public getUnregTasksInfo(): TasksInfo {
    if (!JSON.parse(sessionStorage.getItem(userTasksInfoKey))) {
      const info = { chests: 0, todayAnswersCount: 0, firstTryCount: 0, cristals: 0 };
      sessionStorage.setItem(userTasksInfoKey, JSON.stringify(info));
      return info;
    }
    return JSON.parse(sessionStorage.getItem(userTasksInfoKey));
  }

  public getTasks(
    childId: number,
    offset: number = 0,
    count: number = tasksPerPage,
  ): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.baseUrl}/child/${childId}/tasks/get-tasks?offset=${offset}&count=${count}`,
    );
  }

  public getUnregTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/get-tasks`);
  }
}
