import { Component, OnInit } from '@angular/core';
import { Child } from '../models/children.class';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.less'],
})
export class ChildrenComponent implements OnInit {
  public children: Child[];
  public childrenCount: string;
  public showAddForm: boolean;

  constructor() {
    this.children = [
      { Id: 1, Name: 'Алина Кравцова', Age: 5, Fare: 1, LeftDays: 28, Opened: false },
    ];
    this.showAddForm = false;
  }

  ngOnInit(): void {}

  public toggleAddForm() {
    this.showAddForm = true;
  }

  public deleteChild() {
    this.children = [];
  }

  public addChild() {
    this.children.push({
      Id: 1,
      Name: 'Алина Кравцова',
      Age: 5,
      Fare: 1,
      LeftDays: 28,
      Opened: false,
    });
  }

  public countChildren(): string {
    switch (this.children.length) {
      case 1: {
        return 'второго ';
      }
      case 2: {
        return 'третьего ';
      }
      default: {
        return ' ';
      }
    }
  }
}
