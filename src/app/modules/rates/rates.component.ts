import { Component } from '@angular/core';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.less'],
})
export class RatesComponent {
  public showDiscount = false;
  public discount = 0.9;
  public basePrice = 400;
  public threeMonthPrice = 320;
  public sixMonthPrice = 300;
}
