import { NgModule } from '@angular/core';
import { NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule, PieChartModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProgressComponent } from './progress/progress.component';
import { PaymentsComponent } from './payments/payments.component';
import { HelpComponent } from './help/help.component';
import { ChildrenComponent } from './children/children.component';
import { ProfileService } from './profile.service';
import { UserCardComponent } from './user-card/user-card.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ChartsComponent } from './charts/charts.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProgressComponent,
    PaymentsComponent,
    HelpComponent,
    ChildrenComponent,
    UserCardComponent,
    NotificationsComponent,
    ChartsComponent,
  ],
  imports: [
    ProfileRoutingModule,
    SharedModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgxChartsModule,
    PieChartModule,
  ],
  providers: [ProfileService],
})
export class ProfileModule {}
