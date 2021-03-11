import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
})
export class NavMenuComponent {
  @Input() public showMonkey: boolean;
  public showMenu: boolean;
  public loggedIn: boolean;

  constructor(private modalService: NgbModal, private router: Router) {
    this.showMonkey = true;
    this.showMenu = false;
    this.loggedIn = false;
  }

  public logIn(): void {
    this.modalService.open(LoginComponent, { windowClass: 'modal-log' });
    this.loggedIn = true;
  }

  public logOut(): void {
    this.loggedIn = false;
    this.router.navigate(['']);
  }

  public toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
}
