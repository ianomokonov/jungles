import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  public submitted = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private userService: UserService,
  ) {
    this.logForm = this.fb.group({
      Email: [null, [Validators.required, Validators.email]],
      Password: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.logIn();
  }

  public regRed() {
    this.modal.dismiss();
    this.modalService.open(RegisterComponent, { windowClass: 'modal-reg' });
  }

  public logIn() {
    this.userService.getUser2().subscribe();
    // this.submitted = true;
    // if (this.logForm.invalid) {
    //   return;
    // }
    // const subscription = this.userService
    //   .getUser(this.logForm.value)
    //   .subscribe((token: string[]) => {
    //     if (token) {
    //       sessionStorage.setItem(userTokenKey, token[0]);
    //       sessionStorage.setItem(refreshTokenKey, token[1]);
    //       subscription.unsubscribe();
    //     }
    //   });
  }
}
