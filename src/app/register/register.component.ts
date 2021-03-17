import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeWhile } from 'rxjs/operators';
import { LoginComponent } from '../login/login.component';
import { User } from '../models/user.class';
import { UserService } from '../services/backend/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  public regForm: FormGroup;
  public submitted = false;
  private rxAlive = true;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
  ) {
    this.regForm = this.fb.group({
      nameSurname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      phone: [null],
      canSendNews: [null],
      checkPersonalData: [null, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {}

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public loginRed(): void {
    this.modal.dismiss();
    this.modalService.open(LoginComponent, { windowClass: 'modal-auth' });
  }

  public get formValue() {
    return this.regForm.getRawValue();
  }

  public dismissModal() {
    this.modalService.dismissAll();
  }

  public regUser(content: TemplateRef<any>): void {
    this.submitted = true;
    // if (this.regForm.invalid) {
    //   return;
    // }
    const { formValue } = this;
    const request = {
      name: formValue.nameSurname.split(' ')[0],
      surname: formValue.nameSurname.split(' ')[1],
      email: formValue.email,
      password: formValue.password,
      phone: formValue.phone,
      canSendNews: formValue.canSendNews,
    };
    this.userService
      .addUser(request)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.modal.close();
        this.modalService.open(content, {
          windowClass: 'modal-auth',
        });
      });
  }

  public regRedir() {
    this.modal.close();
    this.router.navigate(['profile']);
  }
}
