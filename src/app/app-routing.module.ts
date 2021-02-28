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
    data: { title: 'Личный кабинет', url: '/profile/children' },
  },
  {
    path: 'tasks',
    loadChildren: () => import('./modules/tasks/tasks.module').then((m) => m.TasksModule),
    data: { title: 'Упражнения' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
