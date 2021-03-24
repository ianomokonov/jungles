import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeWhile } from 'rxjs/operators';
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
  public enter: EventEmitter<void> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {
    this.restorePassForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.logForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
    this.cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public dismissModal() {
    this.modalService.dismissAll();
  }

  public onEnterClick() {
    this.enter.emit();
  }

  public restorePassword(content: TemplateRef<any>) {
    if (this.restorePassForm.invalid) {
      this.restorePassForm.markAllAsTouched();
      return;
    }
    this.userService.refreshPassword(this.restorePassForm.getRawValue().email).subscribe(
      () => {
        this.dismissModal();
        this.modalService.open(content, {
          windowClass: 'modal-auth',
        });
      },
      () => {
        alert('Такого пользователя не существует');
      },
    );
  }

  public openTemplate(content: TemplateRef<any>) {
    this.dismissModal();
    this.modalService.open(content, {
      windowClass: 'modal-auth',
    });
  }

  public logIn() {
    this.submitted = true;
    if (this.logForm.invalid) {
      return;
    }
    this.userService
      .logIn(this.logForm.value)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.router.navigate(['/profile']);
        this.dismissModal();
      });
  }
}
