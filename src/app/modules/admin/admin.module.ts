import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'src/app/services/backend/task.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { CreateAnswerComponent } from './create-task/create-answer/create-answer.component';
import { AnswerLabelPipe } from '../tasks/pipes/answer-label.pipe';
import { CreateVariantComponent } from './create-task/create-variant/create-variant.component';

@NgModule({
  declarations: [
    AdminComponent,
    CreateTaskComponent,
    CreateAnswerComponent,
    AnswerLabelPipe,
    CreateVariantComponent,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgSelectModule,
  ],
  providers: [TaskService],
})
export class AdminModule {}
