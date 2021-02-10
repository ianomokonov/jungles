import { NgModule } from '@angular/core';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';

@NgModule({
  declarations: [TasksComponent],
  imports: [TasksRoutingModule],
})
export class TasksModule {}
