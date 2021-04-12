import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Answer } from 'src/app/models/answer';

@Component({
  selector: 'app-create-answer',
  templateUrl: './create-answer.component.html',
  styleUrls: ['./create-answer.component.less'],
})
export class CreateAnswerComponent implements OnInit {
  @Input() public answersFormArray: FormArray;

  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.addAnswer();
  }

  public get answersForms(): FormGroup[] {
    return this.answersFormArray.controls as FormGroup[];
  }

  public get answers(): Answer[] {
    return this.answersFormArray.value as Answer[];
  }

  public setText(event, answer: FormGroup) {
    const answerTemp = answer;
    answerTemp.get('name').setValue(event.target.innerText);
  }

  public deleteAnswer(index: number) {
    this.answersFormArray.removeAt(index);
  }

  public addAnswer() {
    const formGroup = this.fb.group({
      name: [null, Validators.required],
      isCorrect: false,
    });
    if (this.answersFormArray.controls.some((c) => c.invalid)) {
      this.answersFormArray.markAllAsTouched();
      return;
    }
    this.answersFormArray.push(formGroup);
  }
}
