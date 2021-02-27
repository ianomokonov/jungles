import { Component } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.less'],
})
export class ChildrenComponent {
  public childrenCount: string;
  public showAddForm: boolean;

  constructor(public profileService: ProfileService) {
    this.showAddForm = false;
  }

  public toggleAddForm() {
    this.showAddForm = true;
  }

  public deleteChild() {
    this.profileService.children = [];
  }

  public addChild() {
    this.profileService.children.push({
      id: 1,
      name: 'Алина',
      surname: 'Кравцова',
      age: 5,
      fare: 1,
      leftDays: 28,
      opened: false,
    });
  }

  public countChildren(): string {
    switch (this.profileService.children.length) {
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
