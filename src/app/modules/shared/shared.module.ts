import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploaderComponent } from 'src/app/utils/file-uploader/file-uploader.component';
import { TaskLabelPipe } from '../tasks/pipes/task-label.pipe';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports: [CommonModule, NgbCarouselModule],
  exports: [
    CommonModule,
    NgbCarouselModule,
    PieChartComponent,
    FileUploaderComponent,
    TaskLabelPipe,
    LoadingComponent,
  ],
  declarations: [PieChartComponent, FileUploaderComponent, TaskLabelPipe, LoadingComponent],
})
export class SharedModule {}
