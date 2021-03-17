import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenService } from './backend/token.service';
import { UserService } from './backend/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private userService: UserService, private tokenService: TokenService) {}

  public intercept(req: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {
    let params = req;
    const token = this.tokenService.getAuthToken();
    if (token) {
      params = this.addToken(req, token);
    }
    return next.handle(params);
    // .pipe(
    //   catchError((error) => {
    //     if (error.status === 0) {
    //       return of(error);
    //     }
    //     if (
    //       error instanceof HttpErrorResponse &&
    //       error.status === 401 &&
    //       this.tokenService.getRefreshToken()
    //     ) {
    //       return this.handle401Error(params, next);
    //     }
    //     return throwError(error);
    //   }),
    // );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!this.isRefreshing && refreshToken) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.userService.refreshToken(refreshToken).pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.addToken(request, token.jwt));
        }),
      );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((jwt) => {
        return next.handle(this.addToken(request, jwt));
      }),
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
