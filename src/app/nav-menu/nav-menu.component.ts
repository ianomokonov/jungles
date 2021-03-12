import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthComponent } from '../auth/auth.component';
import { refreshTokenKey, userTokenKey } from '../constants';
import { UserService } from '../services/backend/user.service';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
})
export class NavMenuComponent {
  @Input() public showMonkey: boolean;
  public showMenu: boolean;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    public userService: UserService,
  ) {
    this.showMonkey = true;
    this.showMenu = false;
  }

  public logIn(): void {
    this.modalService.open(AuthComponent, { windowClass: 'modal-auth' });
  }

  public logOut(): void {
    sessionStorage.removeItem(userTokenKey);
    sessionStorage.removeItem(refreshTokenKey);
    this.userService.user = null;
    this.router.navigate(['']);
  }

  public toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
}
