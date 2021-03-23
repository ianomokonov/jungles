import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
    data: {
      style: {
        'background-image': 'url(./assets/images/fon.png)',
        'background-size': '100% 92%',
      },
    },
  },
  {
    path: 'project',
    loadChildren: () => import('./modules/project/project.module').then((m) => m.ProjectModule),
    data: { title: 'О проекте' },
  },
  {
    path: 'rates',
    loadChildren: () => import('./modules/rates/rates.module').then((m) => m.RatesModule),
    data: { title: 'Тарифы' },
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then((m) => m.ProfileModule),
    data: {
      title: 'Личный кабинет',
      url: '/profile/children',
      style: {
        'background-image': 'url(./assets/images/fon_admin2.png)',
        'background-size': '100% auto',
        // 'background-position': 'center -200%',
        'background-repeat': 'no-repeat',
      },
      class: 'profile-page',
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks',
    loadChildren: () => import('./modules/tasks/tasks.module').then((m) => m.TasksModule),
    data: { title: 'Упражнения' },
  },
  {
    path: 'update',
    component: UpdatePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
