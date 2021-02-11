import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
})
export class NavMenuComponent {
  @Input() public showMonkey: boolean;

  constructor(private modalService: NgbModal) {
    this.showMonkey = true;
  }

  public logIn(): void {
    this.modalService.open(LoginComponent, { windowClass: 'modal-log' });
  }
}
