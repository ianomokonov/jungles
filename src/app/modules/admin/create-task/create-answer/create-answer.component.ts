import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Answer } from 'src/app/models/answer';
import { TaskQuestion } from 'src/app/models/task-question';

@Component({
  selector: 'app-create-answer',
  templateUrl: './create-answer.component.html',
  styleUrls: ['./create-answer.component.less'],
})
export class CreateAnswerComponent implements OnInit {
  @Input() public question: TaskQuestion;

  constructor() {}

  ngOnInit(): void {}

  public get answers() {
    return this.question.answers;
  }

  public set answers(answersData: Answer[]) {
    this.question.answers = answersData;
  }

  public setText(event, answer: Answer) {
    const answerTemp = answer;
    answerTemp.name = event.target.innerText;
    if (!event.target.innerText) {
      answerTemp.isNull = true;
      return;
    }
    answerTemp.isNull = false;
  }

  public deleteAnswer(answerId: number) {
    this.answers = this.answers.filter((answer) => answer.id !== answerId);
  }

  public addAnswer() {
    if (this.answers.length > 0) {
      if (!this.answers[this.answers.length - 1].name) {
        this.answers[this.answers.length - 1].isNull = true;
        return;
      }
      this.answers[this.answers.length - 1].isNull = false;
      this.answers.push({ id: this.answers[this.answers.length - 1].id + 1, name: '' } as Answer);
      console.log(this.answers);
      return;
    }
    this.answers.push({ id: 0, name: '' } as Answer);
  }
}
