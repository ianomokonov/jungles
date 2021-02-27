import { Component, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent {
  constructor(private modalService: NgbModal, public modal: NgbActiveModal) {}

  public openModal(content: TemplateRef<any>) {
    this.modalService.open(content, {
      ariaDescribedBy: 'modal-basic-title',
      backdropClass: 'modal-bck-discount',
      windowClass: 'modal-discount',
      centered: true,
    });
  }
}
