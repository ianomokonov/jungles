import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { GridComponent } from './grid/grid.component';
import { TaskImagePipe } from './pipes/task-image.pipe';
import { TaskLabelPipe } from './pipes/task-label.pipe';

@NgModule({
  declarations: [TasksComponent, GridComponent, TaskImagePipe, TaskLabelPipe],
  imports: [TasksRoutingModule, SharedModule],
})
export class TasksModule {}
