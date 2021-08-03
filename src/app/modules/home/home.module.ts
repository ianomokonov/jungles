import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FeedbackSliderComponent } from './feedback-slider/feedback-slider.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HomeComponent, FeedbackSliderComponent],
  imports: [HomeRoutingModule, SharedModule],
})
export class HomeModule {}
