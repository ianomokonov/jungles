import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthComponent } from '../auth/auth.component';
import { ProfileService } from '../modules/profile/profile.service';
import { TokenService } from '../services/backend/token.service';
import { UserService } from '../services/backend/user.service';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
})
export class NavMenuComponent implements OnInit {
  @Input() public showMonkey: boolean;
  public showMenu: boolean;

  constructor(
    private modalService: NgbModal,
    public userService: UserService,
    private profileService: ProfileService,
    private tokenService: TokenService,
  ) {
    this.showMonkey = true;
    this.showMenu = false;
    profileService.openRegForm$.subscribe(() => {
      this.logIn(false);
    });
  }

  ngOnInit() {
    if (this.tokenService.getAuthToken()) {
      this.userService.getUserInfo().subscribe();
    }
  }

  public logIn(isLogin = true): void {
    const modal = this.modalService.open(AuthComponent, { windowClass: 'modal-auth' });
    modal.componentInstance.isLogin = isLogin;
  }

  public exit(): void {
    this.userService.logOut();
  }

  public getUserImg(): string {
    if (this.userService.activeChild) {
      return this.userService.activeChild.image || '../../assets/images/icons/user-child-sm.svg';
    }
    if (this.userService.user) {
      return this.userService.user.image || '../../assets/images/icons/user-parent.svg';
    }
    return '';
  }

  public getAlertsCount() {
    if (this.userService.activeChild) {
      let alertCount = 0;
      this.userService.activeChild.alerts.forEach((alert) => {
        if (!alert.isSeen) {
          alertCount += 1;
        }
      });
      return alertCount;
    }
    return null;
  }

  public toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
}
