import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProgressComponent } from './progress/progress.component';
import { PaymentsComponent } from './payments/payments.component';
import { HelpComponent } from './help/help.component';
import { ChildrenComponent } from './children/children.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProgressComponent,
    PaymentsComponent,
    HelpComponent,
    ChildrenComponent,
  ],
  imports: [ProfileRoutingModule, SharedModule],
})
export class ProfileModule {}
