import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit {
  public regForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
  ) {
    this.regForm = this.fb.group({
      FLName: [null, Validators.required],
      Email: [null, [Validators.required, Validators.email]],
      Phone: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  public loginRed(): void {
    this.modal.dismiss();
    this.modalService.open(LoginComponent, { windowClass: 'modal-log' });
  }
}
