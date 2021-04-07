import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'src/app/services/backend/task.service';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CreateTaskComponent } from './create-task/create-task.component';

@NgModule({
  declarations: [AdminComponent, CreateTaskComponent],
  imports: [AdminRoutingModule, SharedModule, FormsModule, ReactiveFormsModule, NgbAccordionModule],
  providers: [TaskService],
})
export class AdminModule {}
