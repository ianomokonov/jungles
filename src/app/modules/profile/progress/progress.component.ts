import { Component } from '@angular/core';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { periods } from '../../../models/periods';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.less'],
})
export class ProgressComponent {
  public activeUserId: number;
  public activePeriod = 'За все время';
  public showLeftArrow = false;
  public periods = periods;
  constructor(public profileService: ProfileService) {
    this.activeUserId = profileService.children[0]?.id;
  }

  public onUserClick(id: number): void {
    this.activeUserId = id;
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
