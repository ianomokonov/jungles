import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.less'],
})
export class ProgressComponent implements OnInit {
  constructor(public profileService: ProfileService) {}

  ngOnInit(): void {}
}
