import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TasksInfo } from 'src/app/models/tasks-info';
import { environment } from 'src/environments/environment';

@Injectable()
export class TaskService {
  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  public getTasksInfo(childId: number): Observable<TasksInfo> {
    return this.http.get<TasksInfo>(`${this.baseUrl}/child/${childId}/tasks/get-tasks-info`);
  }

  public getTasks(childId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/child/${childId}/tasks/get-tasks`);
  }
}
