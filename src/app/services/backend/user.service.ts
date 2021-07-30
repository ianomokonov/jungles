import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { activeChildKey, modalOpenedKey } from 'src/app/constants';
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
  public userLoaded$: BehaviorSubject<User> = new BehaviorSubject(null);
  public activeChild: Child;
  public get activeChildId(): number {
    return +localStorage.getItem(activeChildKey);
  }
  public set activeChildId(id: number) {
    if (!id) {
      this.activeChild = null;
      localStorage.removeItem(activeChildKey);
      return;
    }
    localStorage.setItem(activeChildKey, id.toString());
    this.activeChild = this.user?.children?.find((child) => child.id === id);
  }

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  public setActive(id: number) {
    this.activeChildId = id;
  }

  public changeInputType(input: any) {
    const elem = input;
    elem.type = input.type === 'password' ? 'text' : 'password';
  }

  public refreshToken(token: string): Observable<string[]> {
    return this.http
      .post<string[]>(`${this.baseUrl}/refresh-token`, { token })
      .pipe(
        tap((tokens: string[]) => {
          this.tokenService.storeTokens(tokens);
        }),
      );
  }

  public checkAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/user/check-admin`);
  }

  public refreshPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/update-password`, { email });
  }

  public setNewPassword(password: string) {
    return this.http.post(`${this.baseUrl}/user/update-password`, { password });
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
  }

  public logOut() {
    const token = this.tokenService.getRefreshToken();
    return (token
      ? this.http.post<string>(`${this.baseUrl}/user/delete-token`, {
          token: this.tokenService.getRefreshToken(),
        })
      : of(null)
    ).pipe(
      tap(() => {
        this.tokenService.removeTokens();
        sessionStorage.removeItem(modalOpenedKey);
        this.activeChildId = null;
        this.user = null;
        if (this.router.url.indexOf('profile') > -1 || this.router.url.indexOf('tasks') > -1) {
          this.router.navigate(['/']);
        }
      }),
    );
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
        this.userLoaded$.next(this.user);
      }),
    );
  }

  public getUsersInfo(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users-info`);
  }

  public editParent(data: FormData) {
    return this.http.post(`${this.baseUrl}/user/update-user-info`, data);
  }

  public uploadParentImg(data): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/user/?`, data);
  }

  // ----------Ребёнок----------

  public addChild(child: FormData): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/user/create-child`, child);
  }

  public editChild(id: number, data: FormData) {
    return this.http.post(`${this.baseUrl}/child/${id}/update`, data);
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
  }

  public getProgress(childId: number, dateFrom?: Date, dateTo?: Date): Observable<Result> {
    return this.http.get<Result>(
      `${this.baseUrl}/child/${childId}/progress?dateFrom=${dateToString(dateFrom) || ''}&dateTo=${
        dateToString(dateTo) || ''
      }`,
    );
  }

  public setAlertsSeen(childId: number, alertIds: number[]) {
    return this.http.put(`${this.baseUrl}/child/${childId}/set-alerts-seen`, { alertIds });
  }

  public addChest(childId: number) {
    return this.http.post(`${this.baseUrl}/child/${childId}/add-chest`, { chestCount: 1 });
  }

  public sendMessage(theme: string, text: string) {
    return this.http.post(`${this.baseUrl}/user/send-message`, { theme, text });
  }

  // ----------Админка----------

  public setDiscount(userId: number) {
    return this.http.post(`${this.baseUrl}/admin/set-discount`, { userId });
  }
}
