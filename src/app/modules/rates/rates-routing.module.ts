import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatesComponent } from './rates.component';

const routes: Routes = [
  {
    path: '',
    component: RatesComponent,
    data: { title: 'Тарифы' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RatesRoutingModule {}
