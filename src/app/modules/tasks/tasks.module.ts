import { NgModule } from '@angular/core';
import { NgbNavModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { GridComponent } from './grid/grid.component';
import { TaskImagePipe } from './pipes/task-image.pipe';
import { TaskComponent } from './task/task.component';

@NgModule({
  declarations: [TasksComponent, GridComponent, TaskImagePipe, TaskComponent],
  imports: [TasksRoutingModule, SharedModule, NgbNavModule, DragDropModule, NgbPopoverModule],
})
export class TasksModule {}
