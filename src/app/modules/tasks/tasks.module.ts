import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { GridComponent } from './grid/grid.component';

@NgModule({
  declarations: [TasksComponent, GridComponent],
  imports: [TasksRoutingModule, SharedModule],
})
export class TasksModule {}
