import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
  ],
  imports: [NoopAnimationsModule, AppRoutingModule, ReactiveFormsModule, FormsModule],
  providers: [NgbModal, NgbActiveModal],
  bootstrap: [AppComponent],
})
export class AppModule {}
