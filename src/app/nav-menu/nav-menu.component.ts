import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthComponent } from '../auth/auth.component';
import { refreshTokenKey } from '../constants';
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
  public showMenu = false;
  public showAlertMessage = false;

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
    this.getUser();
    window.addEventListener('storage', (event) => {
      if (event.key === refreshTokenKey) {
        this.getUser();
      }
    });
  }

  private getUser(): void {
    if (this.tokenService.getAuthToken()) {
      this.userService.getUserInfo().subscribe();
      return;
    }
    this.exit();
  }

  public logIn(isLogin = true): void {
    const modal = this.modalService.open(AuthComponent, { windowClass: 'modal-auth' });
    modal.componentInstance.isLogin = isLogin;
    this.showMenu = false;
  }

  public exit(): void {
    this.showAlertMessage = true;
  }

  public onExitClick(isExit: boolean): void {
    this.showAlertMessage = false;
    if (!isExit) {
      return;
    }

    this.userService.logOut().subscribe();
    this.showMenu = false;
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
    this.showAlertMessage = false;
    this.showMenu = !this.showMenu;
  }
}
