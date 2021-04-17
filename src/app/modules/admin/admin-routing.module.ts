import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { RemoveTaskComponent } from './remove-task/remove-task.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'create-task',
      },
      {
        path: 'create-task',
        component: CreateTaskComponent,
        data: { title: 'Создание упражнения' },
      },
      {
        path: 'remove-task',
        component: RemoveTaskComponent,
        data: { title: 'Удаление упражнения' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
