import { Component } from '@angular/core';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { Payment } from '../../../models/payment';
import { periods } from '../../../models/periods';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.less'],
})
export class PaymentsComponent {
  public activeUserId: number;
  public activePeriod = 'За все время';
  public showLeftArrow = false;
  constructor(public profileService: ProfileService) {
    this.activeUserId = profileService.children[0]?.id;
  }
  public payments: Payment[] = [
    {
      id: 1,
      date: new Date(),
      sum: 1000,
      comment: 'Тариф продлен на 60 дней',
    },
    {
      id: 2,
      date: new Date(),
      sum: 1000,
      comment: 'Тариф продлен на 60 дней',
    },
    {
      id: 3,
      date: new Date(),
      sum: 1000,
      comment: 'Тариф продлен на 60 дней',
    },
  ];
  public periods = periods;

  public onUserClick(id: number): void {
    this.activeUserId = id;
  }

  public getFormattedSum(sum: number): string {
    return new Intl.NumberFormat('ru-RU').format(sum);
  }

  public onSlide(event: NgbSlideEvent) {
    this.onUserClick(this.profileService.children[+event.current].id);
    if (+event.current === 0) {
      this.showLeftArrow = false;
      return;
    }

    this.showLeftArrow = true;
  }
}
