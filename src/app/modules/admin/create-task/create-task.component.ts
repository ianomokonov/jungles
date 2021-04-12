import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Answer } from 'src/app/models/answer';
import { AnswerType } from 'src/app/models/answer-type';
import { Question } from 'src/app/models/question';
import { TaskQuestion } from 'src/app/models/task-question';
import { TaskType } from 'src/app/models/task-type.enum';
import { Variant } from 'src/app/models/variant';
import { TaskService } from 'src/app/services/backend/task.service';
import { CreateAnswerComponent } from './create-answer/create-answer.component';
import { CreateVariantComponent } from './create-variant/create-variant.component';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.less'],
})
export class CreateTaskComponent implements OnInit {
  @ViewChild(CreateAnswerComponent) private answerComponent: CreateAnswerComponent;
  @ViewChild(CreateVariantComponent) private variantComponent: CreateVariantComponent;
  public taskForm: FormGroup;
  public questionsData: TaskQuestion[] = [];
  public answers: Answer[] = [];
  public variants: Variant[] = [];

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      type: [null, Validators.required],
      questions: this.fb.array([]),
    });
    this.taskForm.valueChanges.subscribe((value) => console.log(value));
  }

  public getQuestionFormArray(): FormArray {
    if (!this.questionsData?.length) {
      return this.fb.array([]);
    }
    console.log(this.questionsData);
    const array = this.fb.array([]);
    this.questionsData.forEach((question: TaskQuestion) => {
      array.push(this.getQuestionForm(question));
    });

    return array;
  }

  public getQuestionForm(question: TaskQuestion): FormGroup {
    const formGroup = this.fb.group({
      name: [question.name, Validators.required],
      type: [AnswerType.Choice, Validators.required],
      cristalsCount: 1,
    });
    return formGroup;
  }

  public addQuestion() {
    this.questionsData.push({ name: 'Вопрос', answers: [{ name: '' }] } as TaskQuestion);
    console.log(this.questionsData);
  }

  public deleteQuestion(index: number) {
    console.log(index);
    console.log(this.questionsData);
    delete this.questionsData[index];
    console.log(this.questionsData);
    // this.questionsData.filter((question) => question[] !== index);
  }

  public get questions(): FormGroup[] {
    return (this.taskForm.get('questions') as FormArray).controls as FormGroup[];
  }

  public addAnswer(question: FormGroup) {
    (question.get('answers') as FormArray).push(this.fb.group({ name: 'Ответ' } as Answer));
  }

  public addTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    console.log(this.questionsData);
    console.log(this.taskForm.getRawValue());
    this.taskService
      .addTask([this.taskForm.get('type').value, this.questionsData])
      .subscribe((response) => {
        if (response) {
          alert('Успешно создано!');
          return;
        }
        alert('Всё в гавне!');
      });
  }

  public get taskTypes() {
    const result = [];
    Object.keys(TaskType).forEach((key) => {
      if (!Number.isNaN(+TaskType[key])) {
        result.push({
          id: key,
          name: TaskType[key],
        });
      }
    });
    return result;
  }

  public get questionType() {
    const result = [];
    Object.keys(AnswerType).forEach((key) => {
      if (!Number.isNaN(+AnswerType[key])) {
        result.push({
          id: key,
          name: AnswerType[key],
        });
      }
    });
    return result;
  }
}
