import { AfterViewInit, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.less'],
})
export class ChildrenComponent implements AfterViewInit {
  @Input() public isMobile = false;
  @ViewChild('message') public message: TemplateRef<any>;
  public childrenCount: string;
  public showAddForm: boolean;
  public pickedUserId: number;

  constructor(
    public profileService: ProfileService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
  ) {
    this.showAddForm = false;
  }

  public ngAfterViewInit() {
    if (sessionStorage.getItem('openedModal')) {
      return;
    }
    if (window.innerWidth > 767 && !this.isMobile) {
      this.modalOpen(this.message);
      sessionStorage.setItem('openedModal', 'true');
      return;
    }
    if (window.innerWidth < 768 && this.isMobile) {
      this.modalOpen(this.message);
      sessionStorage.setItem('openedModal', 'true');
    }
  }

  public modalOpen(content: TemplateRef<any>) {
    this.modalService.open(content, {
      backdropClass: 'modal-bck-green',
      windowClass: 'modal-alert',
      centered: true,
    });
  }

  public closeModal() {
    this.modalService.dismissAll();
  }

  public toggleAddForm() {
    this.showAddForm = true;
  }

  public deleteChild() {
    this.profileService.children = [];
  }

  public addChild() {
    this.profileService.children.push({
      id: 1,
      name: 'Алина',
      surname: 'Кравцова',
      age: 5,
      fare: 1,
      leftDays: 28,
      opened: false,
    });
  }

  public setActive(id: number) {
    this.pickedUserId = id;
  }

  public countChildren(): string {
    switch (this.profileService.children.length) {
      case 1: {
        return 'второго ';
      }
      case 2: {
        return 'третьего ';
      }
      default: {
        return ' ';
      }
    }
  }
}
