import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit {
  public regForm: FormGroup;
  public showLog: boolean;
  public showReg: boolean;

  constructor(private fb: FormBuilder, public modal: NgbActiveModal) {
    this.showReg = true;
    this.showLog = false;
    this.regForm = this.fb.group({
      FLName: [null, Validators.required],
      Email: [null, [Validators.required, Validators.email]],
      Phone: [null, Validators.required],
    });
  }

  ngOnInit(): void {}
}
