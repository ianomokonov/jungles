import { Component } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less'],
})
export class GridComponent {
  public tasks = [];
  private breakIndexes: number[] = [0, 3, 5, 8, 12, 14, 17];

  constructor() {
    this.tasks.length = 20;
  }

  public isBreakShown(index: number) {
    return this.breakIndexes.indexOf(index % 19) > -1;
  }
}
