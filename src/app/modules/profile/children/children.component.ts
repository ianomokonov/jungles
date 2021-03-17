import { AfterViewInit, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { blockAmount, tasksAmount } from 'src/app/constants';
import { ChildRequest } from 'src/app/models/add-child-request';
import { Child } from 'src/app/models/child.class';
import { UserService } from 'src/app/services/backend/user.service';
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
  public addChildForm: FormGroup;
  public changeParentForm: FormGroup;
  public changeChildForm: FormGroup;
  public activeChild: ChildRequest;
  public showParentEditForm = false;
  private onDeleteChildId: number;

  constructor(
    public profileService: ProfileService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    public userService: UserService,
    private fb: FormBuilder,
  ) {
    this.showAddForm = false;
    this.addChildForm = this.fb.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
    });
    this.changeParentForm = this.fb.group({
      name: [userService.user?.name, Validators.required],
      surname: [userService.user?.surname, Validators.required],
      email: [userService.user?.email, Validators.required],
    });
    this.changeChildForm = this.fb.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
    });
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

  public addChild() {
    this.userService.addChild(this.addChildForm.value).subscribe((response) => {
      if (response) {
        this.userService.getUserInfo().subscribe(() => {
          this.showAddForm = false;
        });
      }
    });
  }

  public onEditParent() {
    this.showParentEditForm = true;
  }

  public onEditChild(childTemp: Child) {
    const child = childTemp;
    child.editing = true;
    this.activeChild = {
      name: child.name,
      surname: child.surname,
      date: child.dateOfBirth,
    };
    this.changeChildForm.patchValue({
      name: this.activeChild.name,
      surname: this.activeChild.surname,
      dateOfBirth: this.activeChild.date,
    });
  }

  public editParent() {
    this.userService.editParent(this.changeParentForm.getRawValue()).subscribe(() => {
      this.showParentEditForm = false;
      this.userService.getUserInfo().subscribe(() => {});
    });
  }

  public editChild(childTemp: Child) {
    const child = childTemp;
    this.userService.editChild(child.id, this.changeChildForm.getRawValue()).subscribe(() => {
      child.editing = false;
      this.userService.getUserInfo().subscribe(() => {});
    });
  }

  public openDeleteChildModal(child: Child, content: TemplateRef<any>) {
    this.modalService.open(content, {
      backdropClass: 'modal-bck-green',
      windowClass: 'modal-auth',
    });
    this.onDeleteChildId = child.id;
  }

  public deleteChild() {
    this.userService.deleteChild(this.onDeleteChildId).subscribe(() => {
      this.modal.dismiss();
    });
  }

  public getPercentage(amount: number, type: number): number {
    switch (type) {
      case 0:
        return (amount * 100) / blockAmount;
      default:
        return (amount * 100) / tasksAmount;
    }
  }

  public closeModal() {
    this.modalService.dismissAll();
  }

  public toggleAddForm() {
    this.showAddForm = true;
  }

  public setActive(id: number) {
    console.log(id);
    this.userService.activeChildId = id;
  }

  public countChildren(): string {
    switch (this.userService.user?.children?.length) {
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
