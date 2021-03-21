import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { activeChildKey } from 'src/app/constants';
import { Child } from 'src/app/models/child.class';
import { Payment } from 'src/app/models/payment';
import { Result } from 'src/app/models/result.class';
import { User } from 'src/app/models/user.class';
import { dateToString } from 'src/app/modules/profile/utils';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable()
export class UserService {
  private baseUrl: string = environment.baseUrl;
  public user: User;
  public activeChild: Child;
  public get activeChildId(): number {
    return +sessionStorage.getItem(activeChildKey);
  }
  public set activeChildId(id: number) {
    if (!id) {
      this.activeChild = null;
      sessionStorage.removeItem(activeChildKey);
      return;
    }
    sessionStorage.setItem(activeChildKey, id.toString());
    this.activeChild = this.user?.children?.find((child) => child.id === id);
  }

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  public refreshToken(token: string): Observable<string[]> {
    return this.http
      .post<string[]>(`${this.baseUrl}/refresh-token`, { token })
      .pipe(
        tap((tokens: string[]) => {
          this.tokenService.storeTokens(tokens);
        }),
      );
  }

  // ----------Авторизация----------
  public logIn(data: any): Observable<User> {
    return this.http.post<string[]>(`${this.baseUrl}/login`, data).pipe(
      tap((tokens: string[]) => {
        this.tokenService.storeTokens(tokens);
      }),
      mergeMap(() => {
        return this.getUserInfo();
      }),
    );
    // return of(['userToken', 'refreshToken']).pipe(
    //   tap((tokens: string[]) => {
    //     this.tokenService.storeTokens(tokens);
    //   }),
    // );
  }

  public logOut() {
    this.http.delete<string>(
      `${this.baseUrl}/delete-token&token=${this.tokenService.getRefreshToken()}`,
    );
    this.tokenService.removeTokens();
    sessionStorage.removeItem(activeChildKey);
    this.activeChild = null;
    this.user = null;
    if (this.router.url.indexOf('profile') > -1 || this.router.url.indexOf('tasks') > -1) {
      this.router.navigate(['/']);
    }
  }

  public addUser(data: any): Observable<User> {
    return this.http.post<string[]>(`${this.baseUrl}/sign-up`, data).pipe(
      tap((tokens: string[]) => {
        this.tokenService.storeTokens(tokens);
      }),
      mergeMap(() => {
        return this.getUserInfo();
      }),
    );
    // return of([
    //   { id: 2, name: 'Елена', surname: 'Кравцова', email: 'email@email.com' },
    //   ['userToken', 'refreshToken'],
    // ]);
  }

  // ----------Родитель----------

  public getUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/user-info`).pipe(
      tap((user) => {
        this.user = user;
        if (user?.children) {
          if (this.activeChildId) {
            this.activeChild = this.user?.children?.find(
              (child) => child.id === this.activeChildId,
            );
          }
        }
      }),
    );
    // return of({
    //   id: 1,
    //   surname: 'Кравцова',
    //   email: 'email@email.com',
    //   children: [
    //     {
    //       id: 1,
    //       name: 'Алиса',
    //       surname: 'Кравцова',
    //       age: 5,
    //       fare: 32,
    //       leftDays: 28,
    //       opened: false,

    //       results: [
    //         {
    //           id: 1,
    //           blocksDone: 2,
    //           tasksDone: 27,
    //           firstAtt: 11,
    //           crystals: 12,
    //           chests: 2,
    //           month: 'Февраль',
    //           year: 2021,
    //         },
    //         {
    //           id: 2,
    //           blocksDone: 3,
    //           tasksDone: 26,
    //           firstAtt: 2,
    //           crystals: 1,
    //           chests: 6,
    //           month: 'Март',
    //           year: 2021,
    //         },
    //         {
    //           id: 3,
    //           blocksDone: 3,
    //           tasksDone: 34,
    //           firstAtt: 18,
    //           crystals: 20,
    //           chests: 3,
    //           month: 'Апрель',
    //           year: 2021,
    //         },
    //       ],
    //     },
    //     {
    //       id: 2,
    //       name: 'Евгения',
    //       surname: 'Кравцова',
    //       age: 10,
    //       fare: 62,
    //       leftDays: 10,
    //       opened: false,

    //       results: [
    //         {
    //           id: 1,
    //           blocksDone: 2,
    //           tasksDone: 27,
    //           firstAtt: 11,
    //           crystals: 12,
    //           chests: 2,
    //           month: 'Март',
    //           year: 2021,
    //         },
    //       ],
    //     },
    //   ],
    // });
    //
    // return of({
    //   id: 1,
    //   name: 'Марина',
    //   surname: 'Кравцова',
    //   email: 'email@email.com',
    // });
  }

  public editParent(data: any[]) {
    return this.http.put(`${this.baseUrl}/user/user-info`, data);
  }

  public uploadParentImg(data): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/user/?`, data);
  }

  // ----------Ребёнок----------

  public addChild(child: FormData): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/user/create-child`, child);
  }

  public editChild(id: number, data: any[]) {
    return this.http.put(`${this.baseUrl}/child/${id}/update`, data);
  }

  public deleteChild(id: number) {
    return this.http.delete(`${this.baseUrl}/child/${id}/delete`);
  }

  public getChildPayments(childId: number, dateFrom?: Date, dateTo?: Date): Observable<Payment[]> {
    return this.http.get<Payment[]>(
      `${this.baseUrl}/child/${childId}/payments?dateFrom=${dateToString(dateFrom) || ''}&dateTo=${
        dateToString(dateTo) || ''
      }`,
    );
    // return of([
    //   {
    //     id: 1,
    //     date: new Date(),
    //     sum: 1000,
    //     comment: 'Тариф продлен на 10 дней',
    //     month: 'Февраль',
    //     year: 2021,
    //   },
    //   {
    //     id: 2,
    //     date: new Date(),
    //     sum: 1000,
    //     comment: 'Тариф продлен на 20 дней',
    //     month: 'Март',
    //     year: 2021,
    //   },
    //   {
    //     id: 3,
    //     date: new Date(),
    //     sum: 1000,
    //     comment: 'Тариф продлен на 30 дней',
    //     month: 'Апрель',
    //     year: 2021,
    //   },
    // ]);
  }

  public getProgress(childId: number, dateFrom?: Date, dateTo?: Date): Observable<Result> {
    return this.http.get<Result>(
      `${this.baseUrl}/child/${childId}/progress?dateFrom=${dateToString(dateFrom) || ''}&dateTo=${
        dateToString(dateTo) || ''
      }`,
    );
  }

  public setAlertsSeen(childId: number, alertIds: number[]) {
    return this.http.put(`${this.baseUrl}/child/${childId}/set-alerts-seen`, alertIds);
  }

  public sendMessage(theme: string, text: string) {
    return this.http.post(`${this.baseUrl}/user/send-message`, { theme, text });
  }
}
