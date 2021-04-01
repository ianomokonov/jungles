import { Component } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less'],
})
export class GridComponent {
  public tasks = [];
  private breakIndexes: number[] = [0, 3, 5, 8, 12, 14, 17];
  private breakIndexesSm: number[] = [0, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 19];

  constructor() {
    this.tasks.length = 20;
  }

  public isBreakShown(index: number) {
    const width = window.innerWidth;
    if (width > 767) {
      return this.breakIndexes.indexOf(index % 19) > -1;
    }

    return this.breakIndexesSm.indexOf(index % 19) > -1;
  }
}
