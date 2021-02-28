import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.less'],
})
export class ChartsComponent {
  @Input() public sizes: [number, number];
  @Input() public data: number;
  @Input() public colors: string[];
  @Input() public type: string;
  public single: any[];
  public view: any[] = [700, 400];

  // options
  public gradient = true;
  public showLegend = true;
  public showLabels = true;
  public isDoughnut = false;

  public colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor() {
    this.single = [
      {
        name: 'Left Days',
        value: 28,
      },
      {
        name: 'Used Days',
        value: 4,
      },
    ];
  }
}
