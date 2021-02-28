import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Child } from '../models/child.class';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.less'],
})
export class UserCardComponent {
  @Input() public showShadow = false;
  @Input() public user: Child;
  @Input() public showActions = false;
  @Input() public inactive = false;
  @Output() public delete: EventEmitter<void> = new EventEmitter();

  public deleteItem(): void {
    this.delete.emit();
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
