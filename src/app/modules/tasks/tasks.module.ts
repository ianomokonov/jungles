import { NgModule } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { GridComponent } from './grid/grid.component';
import { TaskImagePipe } from './pipes/task-image.pipe';
import { TaskLabelPipe } from './pipes/task-label.pipe';
import { TaskComponent } from './task/task.component';

@NgModule({
  declarations: [TasksComponent, GridComponent, TaskImagePipe, TaskLabelPipe, TaskComponent],
  imports: [TasksRoutingModule, SharedModule, NgbNavModule, DragDropModule],
})
export class TasksModule {}
