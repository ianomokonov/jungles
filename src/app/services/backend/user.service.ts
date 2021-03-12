import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { refreshTokenKey, userTokenKey } from 'src/app/constants';
import { User } from 'src/app/models/user.class';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  private baseUrl: string = environment.baseUrl;
  public user: User | null;

  constructor(private http: HttpClient) {}

  private storeToken(tokens: string[]) {
    sessionStorage.setItem(userTokenKey, tokens[0]);
    sessionStorage.setItem(refreshTokenKey, tokens[1]);
  }

  public refreshToken(token: string): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}?Key=refresh-token`, token).pipe(
      tap((tokens: string[]) => {
        this.storeToken(tokens);
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
        this.storeToken(tokens);
      }),
    );
  }

  public getUserInfo(): Observable<User> {
    // return this.http.get<User>(`${this.baseUrl}?Key=get-userinfo`);
    return of({ id: 1, name: 'Алиса', surname: 'Кравцова', email: 'email@email.com' });
  }
}
