import { Component, HostListener, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent {
  private isMobile = window.innerWidth < 768;
  @HostListener('window:resize', ['$event'])
  public handleResize(event: any) {
    if (this.isMobile) {
      if (event.currentTarget.innerWidth > 767) {
        this.isMobile = false;

        if (this.router.url === '/profile') {
          this.router.navigate(['/profile/children']);
        }
      }
      return;
    }
    if (event.currentTarget.innerWidth < 768) {
      this.isMobile = true;
    }
  }

  constructor(
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private router: Router,
  ) {}

  public openModal(content: TemplateRef<any>) {
    this.modalService.open(content, {
      ariaDescribedBy: 'modal-basic-title',
      backdropClass: 'modal-bck-discount',
      windowClass: 'modal-discount',
      centered: true,
    });
  }

  public closeModal() {
    this.modalService.dismissAll();
  }
}
