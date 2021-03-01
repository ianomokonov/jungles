import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.less'],
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild('chart') public chart: ElementRef<SVGElement>;
  @Input() public color = '#FF952C';
  @Input() public size = 66;
  @Input() public label: string;
  @Input() public set percent(value: number) {
    this.value = (value - 1) / 100;
    this.drawChart();
  }

  private value: number;
  private readonly DASHOFFSET = 157;

  public ngAfterViewInit(): void {
    this.drawChart();
  }

  private drawChart() {
    if (this.chart) {
      const target = this.chart.nativeElement.querySelector('.target');
      const offset = this.DASHOFFSET * this.value;

      target?.setAttribute('stroke-dasharray', `${offset}, ${this.DASHOFFSET - offset}`);
      target?.setAttribute('stroke', `${this.color}`);
      this.chart.nativeElement.setAttribute('height', `${this.size}`);
      this.chart.nativeElement.setAttribute('width', `${this.size}`);
    }
  }
}
