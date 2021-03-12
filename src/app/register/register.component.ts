import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../services/backend/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit {
  public regForm: FormGroup;
  public submitted = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
  ) {
    this.regForm = this.fb.group({
      FLName: [null, Validators.required],
      Email: [null, [Validators.required, Validators.email]],
      Phone: [null, Validators.required],
      CheckMailing: [null],
      CheckPersonalData: [null],
    });
  }

  ngOnInit(): void {}

  public loginRed(): void {
    this.modal.dismiss();
    this.modalService.open(LoginComponent, { windowClass: 'modal-auth' });
  }

  public get fval() {
    return this.regForm.controls;
  }

  public regUser(content: TemplateRef<any>): void {
    this.modal.close();
    this.modalService.open(content, {
      windowClass: 'modal-auth',
    });
    // this.submitted = true;
    // if (this.regForm.invalid) {
    //   return;
    // }
    // const subscription = this.userService
    //   .addUser(this.regForm.value)
    //   .subscribe((response: boolean) => {
    //     if (response) {
    //       this.modal.close();
    //       this.modalService.open(content, {
    //         windowClass: 'modal-auth',
    //       });
    //       subscription.unsubscribe();
    //     }
    //   });
  }

  public regRedir() {
    this.modal.close();
    this.router.navigate(['/profile']);
  }
}
