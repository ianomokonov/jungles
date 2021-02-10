import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'project',
    loadChildren: () => import('./modules/project/project.module').then((m) => m.ProjectModule),
  },
  {
    path: 'rates',
    loadChildren: () => import('./modules/rates/rates.module').then((m) => m.RatesModule),
    data: { title: 'Тарифы' },
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then((m) => m.ProfileModule),
    data: { title: 'Личный кабинет' },
  },
  {
    path: 'tasks',
    loadChildren: () => import('./modules/tasks/tasks.module').then((m) => m.TasksModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
