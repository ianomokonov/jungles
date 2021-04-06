import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { tasksPerPage, userTasksInfoKey, childAnswersKey } from 'src/app/constants';
import { Task } from 'src/app/models/task';
import { TasksInfo } from 'src/app/models/tasks-info';
import { environment } from 'src/environments/environment';
import { nanoid } from 'nanoid';

@Injectable()
export class TaskService {
  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  public getTasksInfo(childId: number): Observable<TasksInfo> {
    return this.http.get<TasksInfo>(`${this.baseUrl}/child/${childId}/tasks/get-tasks-info`);
  }

  public getUnregTasksInfo(): Observable<TasksInfo> {
    if (!JSON.parse(sessionStorage.getItem(userTasksInfoKey))) {
      const info = { chests: 0, answersCount: 0, firstTryCount: 0, cristals: 0 };
      sessionStorage.setItem(userTasksInfoKey, JSON.stringify(info));
      return of(info);
    }
    return of(JSON.parse(sessionStorage.getItem(userTasksInfoKey)));
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
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }

  public getTask(id: number, childId: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/child/${childId}/tasks/${id}`);
  }

  public getUnregTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`);
  }

  public checkAnswer(id: number, childId: number, childAnswerId?: number): Observable<boolean> {
    if (!childId) {
      return this.http
        .post<boolean>(`${this.baseUrl}/check-answer`, {
          id,
        })
        .pipe(
          tap((result) => {
            if (result && sessionStorage.getItem(childAnswersKey)) {
              const answers = JSON.parse(sessionStorage.getItem(childAnswersKey));
              if (childAnswerId) {
                const answer = answers.find((a) => a.id === childAnswerId);
                answer.answerId = id;
                answer.tryCount += 1;
                answer.isCorrect = result;
              } else {
                answers.push({ id: nanoid(11), answerId: id, tryCount: 1, isCorrect: result });
              }

              sessionStorage.setItem(childAnswersKey, JSON.stringify(answers));
            }
          }),
        );
    }
    return this.http.post<boolean>(`${this.baseUrl}/child/${childId}/tasks/check-answer`, {
      id,
      childAnswerId,
    });
  }

  public checkVariants(
    answers: { id: number; variantId: number; childAnswerId?: number }[],
    childId: number,
  ): Observable<{ id: number; variantId: number; isCorrect: boolean }[]> {
    if (!childId) {
      return this.http.post<{ id: number; variantId: number; isCorrect: boolean }[]>(
        `${this.baseUrl}/check-answer-variants`,
        answers,
      );
    }
    return this.http.post<{ id: number; variantId: number; isCorrect: boolean }[]>(
      `${this.baseUrl}/child/${childId}/tasks/check-answer-variants`,
      answers,
    );
  }
}
