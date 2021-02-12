import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RatesRoutingModule } from './rates-routing.module';
import { RatesComponent } from './rates.component';

@NgModule({
  declarations: [RatesComponent],
  imports: [RatesRoutingModule, SharedModule],
})
export class RatesModule {}
