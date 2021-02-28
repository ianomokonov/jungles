import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Child } from '../models/child.class';
import { User } from '../models/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.less'],
})
export class UserCardComponent {
  @Input() public showShadow = false;
  @Input() public set user(user: Child | User) {
    if ('age' in user) {
      this.child = user;
      return;
    }
    this.parent = user;
  }
  @Input() public showActions = false;
  @Input() public inactive = false;
  @Output() public delete: EventEmitter<void> = new EventEmitter();
  @Output() public edit: EventEmitter<void> = new EventEmitter();
  public child: Child;
  public parent: User;
  public get user() {
    return this.child || this.parent;
  }

  public deleteItem(): void {
    this.delete.emit();
  }

  public editItem(): void {
    this.edit.emit();
  }

  public getAgeLabel(age: number) {
    switch (age % 10) {
      case 1:
        return 'год';
      case 2:
      case 3:
      case 4:
        return 'года';
      default:
        return 'лет';
    }
  }
}
