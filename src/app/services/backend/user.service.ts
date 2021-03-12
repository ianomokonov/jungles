import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { refreshTokenKey, userTokenKey } from 'src/app/constants';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  private baseUrl: string = environment.baseUrl;

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

  public addUser(data: any[]): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}?Key=add-user`, data);
  }

  public getUser(data: any[]): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}?Key=get-user`, data).pipe(
      tap((tokens: string[]) => {
        this.storeToken(tokens);
      }),
    );
  }
}
