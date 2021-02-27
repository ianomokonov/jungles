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
        Id: 1,
        Text: `Осталось всего 10 алмазов до заветной цели! Продолжи ударный темп и сундук с сюрпризом у тебя!`,
        Seen: false,
      },
      {
        Id: 1,
        Text: `Осталось всего 10 алмазов до заветной цели!
        Продолжи ударный темп и сундук с сюрпризом у тебя!`,
        Seen: true,
      },
      {
        Id: 1,
        Text:
          'Уважаемая Марина, к  акаунту применена скидка 10% на тариф “60 дней”. Уже сейчас можете воспользоваться ей в разделе Тарифы!',
        Seen: true,
      },
      {
        Id: 1,
        Text:
          'Осталось всего 30 алмазов до заветной цели! Продолжи ударный темп и сундук с сюрпризом у тебя! ',
        Seen: true,
      },
      {
        Id: 1,
        Text:
          'Осталось всего 50 алмазов до заветной цели! Продолжи ударный темп и сундук с сюрпризом у тебя! ',
        Seen: true,
      },
    ];
  }
}
