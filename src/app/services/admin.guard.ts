import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { userTokenKey } from '../constants';
import { UserService } from './backend/user.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  public canActivate(): Observable<boolean> | boolean {
    const currentUserToken = localStorage.getItem(userTokenKey);
    if (currentUserToken) {
      return this.userService.checkAdmin().pipe(
        map((res) => {
          if (res) {
            return true;
          }
          return false;
        }),
      );
    }
    return false;
  }
}
