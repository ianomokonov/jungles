import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import { takeWhile } from 'rxjs/operators';
import { DataService } from 'src/app/services/backend/data.service';
import { UserService } from 'src/app/services/backend/user.service';
import { Question } from '../../../models/question';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less'],
})
export class HelpComponent implements OnDestroy {
  @ViewChild('top') private topPosition: ElementRef;
  private rxAlive = true;
  public messageSent = false;
  public messageForm: FormGroup;
  public currentProblem: string;
  public questions: Question[];
  public problems: string[] = ['Тема 1', 'Тема 2', 'Тема 3'];
  public submitted = false;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {
    this.messageForm = this.fb.group({
      message: [null, Validators.required],
    });
    this.dataService
      .getQuestions()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((data: Question[]) => {
        if (data) {
          this.questions = data;
        }
      });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.topPosition.nativeElement.scrollIntoView({ block: 'start' });
      }
    });
  }

  public ngOnDestroy() {
    this.rxAlive = false;
  }

  public onSelectTopic(problem: string) {
    this.currentProblem = problem;
  }

  public get fval() {
    return this.messageForm.controls;
  }

  public toggleFormDisplay() {
    this.messageSent = false;
    this.fval.Message.setValue(null);
    this.currentProblem = null;
  }

  public sendMsgForm() {
    this.submitted = true;
    if (this.messageForm.invalid) {
      return;
    }
    this.userService
      .sendMessage(this.currentProblem, this.messageForm.getRawValue().message)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.messageSent = true;
        this.messageForm.reset();
      });
  }
}
