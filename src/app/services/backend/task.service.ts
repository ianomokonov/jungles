import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { tasksPerPage, userTasksInfoKey, childAnswersKey } from 'src/app/constants';
import { AnswerType } from 'src/app/models/answer-type';
import { ChildAnswer } from 'src/app/models/child-answer';
import { Task } from 'src/app/models/task';
import { TasksInfo } from 'src/app/models/tasks-info';
import { environment } from 'src/environments/environment';

@Injectable()
export class TaskService {
  private baseUrl: string = environment.baseUrl;
  private defaultInfo = { chests: 0, answersCount: 0, firstTryCount: 0, cristals: 0 };
  constructor(private http: HttpClient) {}

  public getTasksInfo(childId: number): Observable<TasksInfo> {
    return this.http.get<TasksInfo>(`${this.baseUrl}/child/${childId}/tasks/get-tasks-info`);
  }

  public getUnregTasksInfo(): Observable<TasksInfo> {
    if (!JSON.parse(sessionStorage.getItem(userTasksInfoKey))) {
      const info = this.defaultInfo;
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
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`).pipe(
      map((tasks) => {
        const answersJSON = sessionStorage.getItem(childAnswersKey);
        if (answersJSON) {
          const answers = JSON.parse(answersJSON) as ChildAnswer[];
          tasks.forEach((taskTemp) => {
            const task = taskTemp;
            let isSolved = true;
            task.questions.forEach((questionTemp) => {
              const question = questionTemp;
              question.childAnswers = [];
              if (question.type === AnswerType.Choice) {
                isSolved =
                  isSolved &&
                  question.answers.some((a) => {
                    const childAnswer = answers.find((ca) => ca.answerId === a.id);
                    return !!childAnswer?.isCorrect;
                  });
                return;
              }

              isSolved =
                isSolved &&
                !question.answers.some((a) => {
                  const childAnswer = answers.find((ca) => ca.answerId === a.id);
                  return !childAnswer?.isCorrect;
                });
            });

            task.allSolved = isSolved;
          });
        }

        return tasks;
      }),
    );
  }

  public getTask(id: number, childId: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/child/${childId}/tasks/${id}`);
  }

  public getUnregTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`).pipe(
      map((task) => {
        const answersJSON = sessionStorage.getItem(childAnswersKey);
        if (answersJSON) {
          const answers = JSON.parse(answersJSON) as ChildAnswer[];
          task.questions.forEach((questionTemp) => {
            const question = questionTemp;
            question.childAnswers = [];
            question.answers.forEach((answer) => {
              const childAnswer = answers.find((a) => a.answerId === answer.id);
              if (childAnswer) {
                question.childAnswers.push(childAnswer);
              }
            });
            if (question.childAnswers?.length) {
              question.tryCount = question.childAnswers[0].tryCount;
            }
          });
        }

        return task;
      }),
    );
  }

  public addTask(data: Task[]): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/create-task`, data);
  }

  public checkAnswer(id: number, childId: number, childAnswerId?: number): Observable<boolean> {
    if (!childId) {
      return this.http
        .post<boolean>(`${this.baseUrl}/check-answer`, {
          id,
        })
        .pipe(
          tap((result) => {
            const answersJSON = sessionStorage.getItem(childAnswersKey);
            const answers = answersJSON ? JSON.parse(answersJSON) : [];
            let tryCount = 1;
            if (childAnswerId) {
              const answer = answers.find((a) => a.id === childAnswerId);
              answer.answerId = id;
              answer.tryCount += 1;
              tryCount = answer.tryCount;
              answer.isCorrect = result;
            } else {
              answers.push({
                id: new Date().getTime() + answers.length,
                answerId: id,
                tryCount: 1,
                isCorrect: result,
              });
            }

            sessionStorage.setItem(childAnswersKey, JSON.stringify(answers));

            if (result) {
              this.setTasksInfo({
                answersCount: 1,
                firstTryCount: childAnswerId ? 0 : 1,
                cristals: 1,
              });
              return;
            }
            if (tryCount % 3 === 0) {
              this.setTasksInfo({
                cristals: -1,
              });
            }
          }),
        );
    }
    return this.http.post<boolean>(`${this.baseUrl}/child/${childId}/tasks/check-answer`, {
      id,
      childAnswerId,
    });
  }

  public checkVariants(answers: CheckVariants[], childId: number): Observable<CheckVariants[]> {
    if (!childId) {
      return this.http.post<CheckVariants[]>(`${this.baseUrl}/check-answer-variants`, answers).pipe(
        tap((result) => {
          const answersJSON = sessionStorage.getItem(childAnswersKey);
          const localAnswers: ChildAnswer[] = answersJSON ? JSON.parse(answersJSON) : [];
          let allCorrect = true;
          let tryCount = 1;
          result.forEach((answer) => {
            if (answer.childAnswerId) {
              const localAnswer = localAnswers.find((a) => a.id === answer.childAnswerId);
              localAnswer.answerId = answer.id;
              localAnswer.variantId = answer.variantId;
              localAnswer.tryCount += 1;
              localAnswer.isCorrect = answer.isCorrect;
              tryCount = localAnswer.tryCount;
            } else {
              localAnswers.push({
                id: new Date().getTime() + localAnswers.length,
                answerId: answer.id,
                variantId: answer.variantId,
                tryCount: 1,
                isCorrect: answer.isCorrect,
              });
            }

            allCorrect = allCorrect && answer.isCorrect;
          });

          sessionStorage.setItem(childAnswersKey, JSON.stringify(localAnswers));

          if (allCorrect) {
            this.setTasksInfo({
              answersCount: 1,
              firstTryCount: result[0].childAnswerId ? 0 : 1,
              cristals: 1,
            });
            return;
          }
          if (tryCount % 3 === 0) {
            this.setTasksInfo({
              cristals: -1,
            });
          }
        }),
      );
    }
    return this.http.post<CheckVariants[]>(
      `${this.baseUrl}/child/${childId}/tasks/check-answer-variants`,
      answers,
    );
  }

  private setTasksInfo({ chests, answersCount, firstTryCount, cristals }: Partial<TasksInfo>) {
    const info = (JSON.parse(sessionStorage.getItem(userTasksInfoKey)) ||
      this.defaultInfo) as TasksInfo;

    info.chests += chests || 0;
    info.answersCount += answersCount || 0;
    info.firstTryCount += firstTryCount || 0;
    info.cristals += cristals || 0;

    sessionStorage.setItem(userTasksInfoKey, JSON.stringify(info));
  }
}

export interface CheckVariants {
  id: number;
  variantId: number;
  isCorrect?: boolean;
  childAnswerId?: number;
}
