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
  public submitted = false;

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
      image: [null],
      surname: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
    });
    this.changeParentForm = this.fb.group({
      name: [userService.user?.name, Validators.required],
      image: [userService.user?.image],
      surname: [userService.user?.surname, Validators.required],
      email: [userService.user?.email, Validators.required],
    });
    this.changeChildForm = this.fb.group({
      name: [null, Validators.required],
      image: [userService.activeChild?.image],
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

  public get dateOfBirth() {
    return this.changeChildForm.get('dateOfBirth');
  }

  public addChild() {
    this.submitted = true;
    if (this.addChildForm.invalid) {
      return;
    }
    const formValue = this.addChildForm.getRawValue();
    this.userService.addChild(this.getFormData(formValue)).subscribe((response) => {
      if (response) {
        this.userService.getUserInfo().subscribe(() => {
          this.showAddForm = false;
        });
      }
    });
  }

  public onEditParent() {
    this.showParentEditForm = true;
    this.changeParentForm.patchValue({
      image: this.userService.user.image,
      name: this.userService.user.name,
      surname: this.userService.user.surname,
      email: this.userService.user.email,
    });
  }

  public onEditChild(childTemp: Child) {
    const child = childTemp;
    child.editing = true;
    this.activeChild = {
      image: child.image,
      name: child.name,
      surname: child.surname,
      date: child.dateOfBirth,
    };
    this.changeChildForm.patchValue({
      image: this.activeChild.image,
      name: this.activeChild.name,
      surname: this.activeChild.surname,
      dateOfBirth: this.activeChild.date,
    });
  }

  public editParent() {
    if (this.changeParentForm.invalid) {
      return;
    }
    const newParentInfo = this.changeParentForm.getRawValue();
    this.userService.editParent(this.getFormData(newParentInfo)).subscribe(() => {
      this.showParentEditForm = false;
      this.userService.getUserInfo().subscribe(() => {});
    });
  }

  public editChild(childTemp: Child) {
    if (this.changeChildForm.invalid) {
      return;
    }
    const child = childTemp;
    const formValue = this.changeChildForm.getRawValue();
    this.userService.editChild(child.id, this.getFormData(formValue)).subscribe(() => {
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

  public removeImg(form: FormGroup) {
    form.get('image').setValue(null);
  }

  public isUploadFileShown(form: FormGroup) {
    const { value } = form.get('image');

    return !value || value instanceof File;
  }

  private getFormData(data: any) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.set(key, data[key]);
    });
    return formData;
  }
}
