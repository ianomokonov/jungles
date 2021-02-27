import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.less'],
})
export class UserCardComponent {
  @Input() public showShadow = false;
  @Input() public showActions = false;
  @Output() public delete: EventEmitter<void> = new EventEmitter();

  public deleteItem(): void {
    this.delete.emit();
  }
}
