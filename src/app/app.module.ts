import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask';

// ------Rooting------
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './services/auth.guard';

// ------Services------
import { AuthInterceptor } from './services/auth.interceptor';

// ------Components------
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './services/backend/user.service';
import { AuthComponent } from './auth/auth.component';
import { TokenService } from './services/backend/token.service';
import { CheckboxComponent } from './utils/checkbox/checkbox.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { ProfileService } from './modules/profile/profile.service';
import { TaskService } from './services/backend/task.service';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    AuthComponent,
    CheckboxComponent,
    UpdatePasswordComponent,
  ],
  imports: [
    NoopAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot(maskConfig),
  ],
  providers: [
    NgbModal,
    NgbActiveModal,
    HttpClient,
    AuthGuard,
    UserService,
    ProfileService,
    TaskService,
    TokenService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
