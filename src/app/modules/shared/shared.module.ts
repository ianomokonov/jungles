import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploaderComponent } from 'src/app/utils/file-uploader/file-uploader.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  imports: [CommonModule, NgbCarouselModule],
  exports: [CommonModule, NgbCarouselModule, PieChartComponent, FileUploaderComponent],
  declarations: [PieChartComponent, FileUploaderComponent],
})
export class SharedModule {}
