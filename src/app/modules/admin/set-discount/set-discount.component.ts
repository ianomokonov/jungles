import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/services/backend/user.service';

@Component({
  selector: 'app-set-discount',
  templateUrl: './set-discount.component.html',
  styleUrls: ['./set-discount.component.less'],
})
export class SetDiscountComponent implements OnInit, OnDestroy {
  public users: User[];
  public selectedUserId: number;
  private rxAlive = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService
      .getUsersInfo()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((data) => {
        this.users = data.filter((user) => !user.hasDiscount);
      });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public setDiscount() {
    this.userService
      .setDiscount(this.selectedUserId)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.selectedUserId = null;
        this.ngOnInit();
        alert('Скидка успешно применена!');
      });
  }
}
