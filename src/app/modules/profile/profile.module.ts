import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProgressComponent } from './progress/progress.component';
import { PaymentsComponent } from './payments/payments.component';
import { HelpComponent } from './help/help.component';
import { ChildrenComponent } from './children/children.component';
import { ProfileService } from './profile.service';
import { UserCardComponent } from './user-card/user-card.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProgressComponent,
    PaymentsComponent,
    HelpComponent,
    ChildrenComponent,
    UserCardComponent,
  ],
  imports: [ProfileRoutingModule, SharedModule, NgbDropdownModule],
  providers: [ProfileService],
})
export class ProfileModule {}
