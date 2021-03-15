import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { activeChildKey, userTokenKey } from 'src/app/constants';
import { Child } from 'src/app/models/child.class';
import { Payment } from 'src/app/models/payment';
import { Period } from 'src/app/models/periods';
import { Result } from 'src/app/models/result.class';
import { User } from 'src/app/models/user.class';
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
    sessionStorage.setItem(activeChildKey, id.toString());
    this.activeChild = this.user?.children?.find((child) => child.id === this.activeChildId);
  }

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {
    if (sessionStorage.getItem(userTokenKey)) {
      this.getUserInfo().subscribe((data) => {
        this.user = data;
        if (this.activeChildId) {
          this.activeChild = this.user.children?.find((child) => child.id === this.activeChildId);
        }
      });
    }
  }

  public refreshToken(token: string): Observable<string[]> {
    return this.http
      .post<string[]>(`${this.baseUrl}?Key=refresh-token`, { token })
      .pipe(
        tap((tokens: string[]) => {
          this.tokenService.storeTokens(tokens);
        }),
      );
  }

  // ----------Общие----------

  public getPeriods(user: Child): Period[] {
    const periods: Period[] = [];
    user.results.forEach((result: Result) => {
      periods.push({ month: result.month, year: result.year });
    });
    return periods;
  }

  // ----------Авторизация----------
  public logIn(data: any[]): Observable<string[]> {
    // return this.http.post<string[]>(`${this.baseUrl}/login`, data).pipe(
    //   tap((tokens: string[]) => {
    //     this.storeToken(tokens);
    //   }),
    // );
    return of(['userToken', 'refreshToken']).pipe(
      tap((tokens: string[]) => {
        this.tokenService.storeTokens(tokens);
      }),
    );
  }

  public logOut() {
    this.http.delete<string>(
      `${this.baseUrl}?Key=delete-token&token=${this.tokenService.getRefreshToken()}`,
    );
    this.tokenService.removeTokens();
    sessionStorage.removeItem(activeChildKey);
    this.activeChild = null;
    this.user = null;
    if (this.router.url.indexOf('profile') > -1 || this.router.url.indexOf('tasks') > -1) {
      this.router.navigate(['/']);
    }
  }

  public addUser(data: any[]): Observable<[User, [string, string]]> {
    // return this.http.post<[User, [string, string]]>(`${this.baseUrl}/add-user`, data);
    return of([
      { id: 2, name: 'Елена', surname: 'Кравцова', email: 'email@email.com' },
      ['userToken', 'refreshToken'],
    ]);
  }

  // ----------Данные----------

  public getUserInfo(): Observable<User> {
    // return this.http.get<User>(`${this.baseUrl}/get-userinfo`);
    return of({
      id: 1,
      name: 'Марина',
      surname: 'Кравцова',
      email: 'email@email.com',
      children: [
        {
          id: 1,
          name: 'Алиса',
          surname: 'Кравцова',
          age: 5,
          fare: 32,
          leftDays: 28,
          opened: false,

          results: [
            {
              id: 1,
              blocksDone: 2,
              tasksDone: 27,
              firstAtt: 11,
              crystals: 12,
              chests: 2,
              month: 'Февраль',
              year: 2021,
            },
            {
              id: 2,
              blocksDone: 3,
              tasksDone: 26,
              firstAtt: 2,
              crystals: 1,
              chests: 6,
              month: 'Март',
              year: 2021,
            },
            {
              id: 3,
              blocksDone: 3,
              tasksDone: 34,
              firstAtt: 18,
              crystals: 20,
              chests: 3,
              month: 'Апрель',
              year: 2021,
            },
          ],
        },
        {
          id: 2,
          name: 'Евгения',
          surname: 'Кравцова',
          age: 10,
          fare: 62,
          leftDays: 10,
          opened: false,

          results: [
            {
              id: 1,
              blocksDone: 2,
              tasksDone: 27,
              firstAtt: 11,
              crystals: 12,
              chests: 2,
              month: 'Март',
              year: 2021,
            },
          ],
        },
      ],
    });
    //
    // return of({
    //   id: 1,
    //   name: 'Марина',
    //   surname: 'Кравцова',
    //   email: 'email@email.com',
    // });
  }

  public getChildPayments(childId: number): Observable<Payment[]> {
    // return this.http.get<Payment[]>(`${this.baseUrl}?Key=get-childpay&id=${childId}`);
    return of([
      {
        id: 1,
        date: new Date(),
        sum: 1000,
        comment: 'Тариф продлен на 10 дней',
        month: 'Февраль',
        year: 2021,
      },
      {
        id: 2,
        date: new Date(),
        sum: 1000,
        comment: 'Тариф продлен на 20 дней',
        month: 'Март',
        year: 2021,
      },
      {
        id: 3,
        date: new Date(),
        sum: 1000,
        comment: 'Тариф продлен на 30 дней',
        month: 'Апрель',
        year: 2021,
      },
    ]);
  }
}
