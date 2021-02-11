import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  public logForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
  ) {
    this.logForm = this.fb.group({
      Email: [null, [Validators.required, Validators.email]],
      Password: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  public regRed() {
    this.modal.dismiss();
    this.modalService.open(RegisterComponent, { windowClass: 'modal-log' });
  }
}
