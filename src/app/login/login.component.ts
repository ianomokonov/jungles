import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeWhile } from 'rxjs/operators';
import { User } from '../models/user.class';
import { UserService } from '../services/backend/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public logForm: FormGroup;
  public restorePassForm: FormGroup;
  public submitted = false;
  private rxAlive = true;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {
    this.restorePassForm = this.fb.group({
      Email: [null, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.logForm = this.fb.group({
      Email: [null, [Validators.required, Validators.email]],
      Password: [null, Validators.required],
    });
    this.cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public dismissModal() {
    this.modalService.dismissAll();
  }

  public openTemplate(content: TemplateRef<any>) {
    this.dismissModal();
    this.modalService.open(content, {
      windowClass: 'modal-auth',
    });
  }

  public logIn() {
    this.submitted = true;
    // if (this.logForm.invalid) {
    //   return;
    // }
    this.userService
      .getUser(this.logForm.value)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((token: string[]) => {
        if (token) {
          this.userService
            .getUserInfo()
            .pipe(takeWhile(() => this.rxAlive))
            .subscribe((data: User) => {
              this.userService.user = data;
              this.router.navigate(['/profile']);
            });
        }
      });
    this.dismissModal();
  }
}
