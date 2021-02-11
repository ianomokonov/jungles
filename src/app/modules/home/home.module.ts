import { NgModule } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FeedbackSliderComponent } from './feedback-slider/feedback-slider.component';

@NgModule({
  declarations: [HomeComponent, FeedbackSliderComponent],
  imports: [HomeRoutingModule, NgbCarouselModule, CommonModule],
})
export class HomeModule {}
