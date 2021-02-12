import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
})
export class NavMenuComponent {
  @Input() public showMonkey: boolean;
  public showMenu: boolean;

  constructor(private modalService: NgbModal) {
    this.showMonkey = true;
    this.showMenu = false;
  }

  public logIn(): void {
    // this.modalService.open(LoginComponent, { windowClass: 'modal-log' });
  }

  public toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
}
