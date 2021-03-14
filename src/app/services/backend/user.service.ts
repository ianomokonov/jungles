import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { activeChildKey, userTokenKey } from 'src/app/constants';
import { Child } from 'src/app/models/child.class';
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

  public refreshToken(token: string): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}?Key=refresh-token`, token).pipe(
      tap((tokens: string[]) => {
        this.tokenService.storeTokens(tokens);
      }),
    );
  }

  public addUser(data: any[]): Observable<[User, [string, string]]> {
    // return this.http.post<[User, [string, string]]>(`${this.baseUrl}?Key=add-user`, data);
    return of([
      { id: 2, name: 'Елена', surname: 'Кравцова', email: 'email@email.com' },
      ['userToken', 'refreshToken'],
    ]);
  }

  public getUser(data: any[]): Observable<string[]> {
    // return this.http.post<string[]>(`${this.baseUrl}?Key=get-user`, data).pipe(
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

  public getUserInfo(): Observable<User> {
    // return this.http.get<User>(`${this.baseUrl}?Key=get-userinfo`);
    return of({
      id: 1,
      name: 'Марина',
      surname: 'Кравцова',
      email: 'email@email.com',
      // children: [
      //   {
      //     id: 1,
      //     name: 'Алиса',
      //     surname: 'Кравцова',
      //     age: 5,
      //     fare: 32,
      //     leftDays: 28,
      //     opened: false,
      //   },
      //   {
      //     id: 2,
      //     name: 'Евгения',
      //     surname: 'Кравцова',
      //     age: 5,
      //     fare: 32,
      //     leftDays: 28,
      //     opened: false,
      //   },
      // ],
    });
    //
    // return of({
    //   id: 1,
    //   name: 'Марина',
    //   surname: 'Кравцова',
    //   email: 'email@email.com',
    // });
  }
}
