import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.less'],
})
export class ChildrenComponent implements OnInit {
  public children: any[];
  public addChild: boolean;

  constructor() {
    this.children = [];
    this.addChild = false;
  }

  ngOnInit(): void {}

  public toggleAddForm() {
    this.addChild = true;
  }
}

// Не даёт экспортировать сразу 2 класса
// export class Child {
//   Name: string;
//   Age: number;
//   Fare: number;
//   LeftDays: number;
// }

// Пока не сделал класс ребенка и нет бд нужно данные снизу добавить в массив на 13 строке
// { Name: 'Алина Кравцова', Age: 5, Fare: 1, LeftDays: 28, Opened: false }
