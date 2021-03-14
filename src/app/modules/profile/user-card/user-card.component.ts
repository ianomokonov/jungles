import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Child } from '../../../models/child.class';
import { User } from '../../../models/user.class';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.less'],
})
export class UserCardComponent {
  @Input() public showShadow = false;
  @Input() public set user(user: Child | User) {
    if (!user) {
      this.child = null;
      this.parent = null;
      this.profilePicture = null;
      return;
    }
    if ('age' in user) {
      this.child = user;
      this.profilePicture = '../../../../assets/images/icons/user-child.svg';
      return;
    }
    this.parent = user;
    this.profilePicture = '../../../../assets/images/icons/user-parent.svg';
  }
  @Input() public showActions = false;
  @Input() public showDelete = false;
  @Input() public inactive = false;
  @Output() public delete: EventEmitter<void> = new EventEmitter();
  @Output() public edit: EventEmitter<void> = new EventEmitter();
  public child: Child;
  public parent: User;
  public profilePicture: string;
  public get user() {
    return this.child || this.parent;
  }

  public deleteItem(): void {
    this.delete.emit();
  }

  public getPhoto(): string {
    if (this.user.profilePicture) {
      return this.user.profilePicture;
    }
    return this.profilePicture;
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
