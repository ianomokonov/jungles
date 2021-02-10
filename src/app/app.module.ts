import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [AppComponent, NavMenuComponent, FooterComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [NgbModal, NgbActiveModal],
  bootstrap: [AppComponent],
})
export class AppModule {}
