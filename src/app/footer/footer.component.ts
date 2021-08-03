import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../modules/profile/profile.service';
import { TokenService } from '../services/backend/token.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer-blocks.component.html',
  styleUrls: ['./footer.component.less'],
})
export class FooterComponent {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private modalService: NgbModal,
    private profileService: ProfileService,
  ) {}
  public scrollToTop() {
    window.scroll(0, 0);
  }

  public dismissModal() {
    this.modalService.dismissAll();
  }

  public onHelpClick(template) {
    if (this.tokenService.getAuthToken()) {
      this.router.navigate(['/profile/help']);
      return;
    }

    this.modalService.open(template, {
      backdropClass: 'modal-bck-green',
      windowClass: 'modal-auth',
    });
  }

  public onRegClick() {
    this.dismissModal();
    this.profileService.openRegForm$.next();
  }
}
