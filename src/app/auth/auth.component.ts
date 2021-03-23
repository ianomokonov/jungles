import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less'],
})
export class AuthComponent implements AfterViewInit {
  @ViewChild('content', { read: ViewContainerRef }) public content: ViewContainerRef;
  public isLogin = true;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef,
    public modal: NgbActiveModal,
    public modalService: NgbModal,
  ) {}

  public ngAfterViewInit(): void {
    this.onLoginClick();
  }

  public onSignUpClick() {
    this.isLogin = false;
    this.content.clear();
    const signUpComponent = this.componentFactoryResolver.resolveComponentFactory(
      RegisterComponent,
    );
    this.content.createComponent(signUpComponent);
    this.cdRef.detectChanges();
  }

  public onLoginClick() {
    this.isLogin = true;
    this.content.clear();
    const loginComponent = this.componentFactoryResolver.resolveComponentFactory(LoginComponent);
    const component = this.content.createComponent(loginComponent);
    component.instance.enter.subscribe(() => {
      this.modalService.dismissAll();
      this.modalService.open(AuthComponent, { windowClass: 'modal-auth' });
    });
    this.cdRef.detectChanges();
  }
}
