import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChildrenComponent } from './children/children.component';
import { HelpComponent } from './help/help.component';
import { PaymentsComponent } from './payments/payments.component';
import { ProfileComponent } from './profile.component';
import { ProgressComponent } from './progress/progress.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'children',
        component: ChildrenComponent,
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: { title: 'Успехи' },
      },
      {
        path: 'payments',
        component: PaymentsComponent,
        data: { title: 'История оплат' },
      },
      {
        path: 'help',
        component: HelpComponent,
        data: { title: 'Помощь' },
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: { title: 'Уведомления' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
