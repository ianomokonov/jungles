import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthComponent } from '../auth/auth.component';
import { TokenService } from '../services/backend/token.service';
import { UserService } from '../services/backend/user.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.less'],
})
export class UpdatePasswordComponent implements OnInit, AfterViewInit {
  @ViewChild('newPass') public content: TemplateRef<any>;
  public newPassForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
    private fb: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
  ) {
    this.newPassForm = this.fb.group({
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  public ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.updatePassword) {
        this.tokenService.storeTokens([params.updatePassword, null]);
        this.modalService.open(this.content, { windowClass: 'modal-auth' });
      }
    });
  }

  public dismissModal() {
    this.modalService.dismissAll();
    this.router.navigate(['']);
  }

  public restorePassword() {
    if (this.newPassForm.invalid) {
      this.newPassForm.markAllAsTouched();
      return;
    }
    this.userService.setNewPassword(this.newPassForm.getRawValue().password).subscribe(() => {
      this.dismissModal();
      this.router.navigate(['']);
      this.modalService.open(AuthComponent, { windowClass: 'modal-auth' });
    });
  }
}
