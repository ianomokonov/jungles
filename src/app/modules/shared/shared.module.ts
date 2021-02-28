import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, NgbCarouselModule],
  exports: [CommonModule, NgbCarouselModule],
})
export class SharedModule {}
