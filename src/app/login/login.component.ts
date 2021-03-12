import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { refreshTokenKey, userTokenKey } from '../constants';
import { RegisterComponent } from '../register/register.component';
import { UserService } from '../services/backend/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  public logForm: FormGroup;
  public restorePassForm: FormGroup;
  public submitted = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
  ) {
    this.logForm = this.fb.group({
      Email: [null, [Validators.required, Validators.email]],
      Password: [null, Validators.required],
    });
    this.restorePassForm = this.fb.group({
      Email: [null, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  public dismissModal() {
    this.modalService.dismissAll();
  }

  public regRed() {
    this.dismissModal();
    this.modalService.open(RegisterComponent, { windowClass: 'modal-auth' });
  }

  public openTemplate(content: TemplateRef<any>) {
    this.dismissModal();
    this.modalService.open(content, {
      windowClass: 'modal-auth',
    });
  }

  public logIn() {
    sessionStorage.setItem(userTokenKey, 'dadadadadaddadadaadadad');
    sessionStorage.setItem(refreshTokenKey, 'sasasasasaasasasaasasasa');
    this.dismissModal();
    setTimeout(() => {
      this.router.navigate(['/profile']);
    }, 1000);
    // this.submitted = true;
    // if (this.logForm.invalid) {
    //   return;
    // }
    // const subscription = this.userService
    //   .getUser(this.logForm.value)
    //   .subscribe((token: string[]) => {
    //     if (token) {
    //       subscription.unsubscribe();
    //     }
    //   });
  }
}
