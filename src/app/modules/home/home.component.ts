import { Component } from '@angular/core';
import { childAnswersKey, userTasksInfoKey } from 'src/app/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent {
  constructor() {
    sessionStorage.removeItem(childAnswersKey);
    sessionStorage.removeItem(userTasksInfoKey);
  }
}
