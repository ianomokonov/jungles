import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { DataService } from 'src/app/services/backend/data.service';
import { Question } from '../../../models/question';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less'],
})
export class HelpComponent implements OnDestroy {
  private rxAlive = true;
  public messageSent = false;
  public messageForm: FormGroup;
  public currentProblem: string;
  public questions: Question[];
  public problems: string[] = ['Тема 1', 'Тема 2', 'Тема 3'];
  public submitted = false;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      Message: [null, Validators.required],
    });
    this.dataService
      .getQuestions()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((data: Question[]) => {
        if (data) {
          this.questions = data;
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
    this.dataService
      .sendMessage(this.currentProblem, this.messageForm.value)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((response: boolean) => {
        if (response) {
          this.messageSent = true;
        }
      });
  }
}
