import { Component } from '@angular/core';
import { Payment } from '../models/payment';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.less'],
})
export class PaymentsComponent {
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

  public getFormattedSum(sum: number): string {
    return new Intl.NumberFormat('ru-RU').format(sum);
  }
}
