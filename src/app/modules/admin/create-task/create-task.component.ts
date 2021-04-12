import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { Answer } from 'src/app/models/answer';
import { AnswerType } from 'src/app/models/answer-type';
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
  public taskTypes: NgOption[] = [];
  public answerTypes: NgOption[] = [];
  public answerType = AnswerType;

  public get questionForms(): FormGroup[] {
    return (this.taskForm.get('questions') as FormArray).controls as FormGroup[];
  }

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskTypes = this.getListItems(TaskType);
    this.answerTypes = this.getListItems(AnswerType);

    console.log(this.answerTypes);
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      type: [null, Validators.required],
      questions: this.fb.array([]),
    });
    this.taskForm.valueChanges.subscribe((value) => console.log(value));
  }

  public addQuestion() {
    this.questionsData.push({ name: null, answers: [{ name: '' }] } as TaskQuestion);
    (this.taskForm.get('questions') as FormArray).push(
      this.fb.group({
        name: null,
        type: null,
        answers: this.fb.array([this.fb.group({ name: null })]),
      }),
    );
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

  public getListItems(source) {
    const result = [];
    Object.keys(source).forEach((key) => {
      if (!Number.isNaN(+source[key])) {
        result.push({
          id: key,
          name: source[key],
        });
      }
    });
    return result;
  }

  public getAnswersArray(question: FormGroup) {
    return question.get('answers') as FormArray;
  }
}
