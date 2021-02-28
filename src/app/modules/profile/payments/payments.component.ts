import { Component } from '@angular/core';
import { Payment } from '../models/payment';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.less'],
})
export class PaymentsComponent {
  public activeUserId: number;
  constructor(public profileService: ProfileService) {
    this.activeUserId = profileService.children[0]?.id;
  }
  public payments: Payment[] = [
    {
      date: new Date(),
      sum: 1000,
      comment: 'Тариф продлен на 60 дней',
    },
    {
      date: new Date(),
      sum: 1000,
      comment: 'Тариф продлен на 60 дней',
    },
    {
      date: new Date(),
      sum: 1000,
      comment: 'Тариф продлен на 60 дней',
    },
  ];

  public onUserClick(id: number): void {
    this.activeUserId = id;
  }

  public getFormattedSum(sum: number): string {
    return new Intl.NumberFormat('ru-RU').format(sum);
  }
}
