import { Component, OnInit } from '@angular/core';
import { Notification } from '../models/notification.class';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less'],
})
export class NotificationsComponent implements OnInit {
  public notifications: Notification[];

  constructor() {
    this.notifications = [];
  }

  ngOnInit(): void {
    this.notifications = [
      {
        id: 1,
        text: `Осталось всего 10 алмазов до заветной цели! Продолжи ударный темп и сундук с сюрпризом у тебя!`,
        seen: false,
      },
      {
        id: 1,
        text: `Осталось всего 10 алмазов до заветной цели!
        Продолжи ударный темп и сундук с сюрпризом у тебя!`,
        seen: true,
      },
      {
        id: 1,
        text:
          'Уважаемая Марина, к  акаунту применена скидка 10% на тариф “60 дней”. Уже сейчас можете воспользоваться ей в разделе Тарифы!',
        seen: true,
      },
      {
        id: 1,
        text:
          'Осталось всего 30 алмазов до заветной цели! Продолжи ударный темп и сундук с сюрпризом у тебя! ',
        seen: true,
      },
      {
        id: 1,
        text:
          'Осталось всего 50 алмазов до заветной цели! Продолжи ударный темп и сундук с сюрпризом у тебя! ',
        seen: true,
      },
    ];
  }
}
