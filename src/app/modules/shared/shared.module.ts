import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  imports: [CommonModule, NgbCarouselModule],
  exports: [CommonModule, NgbCarouselModule, PieChartComponent],
  declarations: [PieChartComponent],
})
export class SharedModule {}
