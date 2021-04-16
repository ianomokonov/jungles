import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { Answer } from 'src/app/models/answer';
import { AnswerType } from 'src/app/models/answer-type';
import { TaskType } from 'src/app/models/task-type.enum';
import { Variant } from 'src/app/models/variant';
import { TaskService } from 'src/app/services/backend/task.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.less'],
})
export class CreateTaskComponent implements OnInit {
  public taskForm: FormGroup;
  public answers: Answer[] = [];
  public variants: Variant[] = [];
  public taskTypes: NgOption[] = [];
  public answerTypes: NgOption[] = [];
  public answerType = AnswerType;

  public get questionForms(): FormGroup[] {
    return (this.taskForm.get('questions') as FormArray).controls as FormGroup[];
  }

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.taskTypes = this.getListItems(TaskType);
    this.answerTypes = this.getListItems(AnswerType);
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      type: [null, Validators.required],
      questions: this.fb.array([]),
    });
    this.addQuestion();
  }

  public get questions(): FormGroup[] {
    return (this.taskForm.get('questions') as FormArray).controls as FormGroup[];
  }

  public addQuestion() {
    const formGroup = this.fb.group({
      name: null,
      type: this.answerType.Choice,
      answers: this.fb.array([], (formArray: FormArray) => {
        if (formArray.controls.length) {
          const value = formArray.getRawValue();
          const hasCorrectAnswer = value.some((v) => v.isCorrect);
          console.log(formArray);
          console.log(value, hasCorrectAnswer);
          if (!hasCorrectAnswer) {
            return { noCorrectAnswer: true };
          }
        }
        return null;
      }),
    });
    (this.taskForm.get('questions') as FormArray).push(formGroup);
    formGroup.get('type').valueChanges.subscribe((value) => {
      if (value === this.answerType.Variants) {
        formGroup.addControl(
          'variants',
          this.fb.array([
            this.fb.group({ name: [null, Validators.required], answers: this.fb.array([]) }),
          ]),
        );
        formGroup.removeControl('answers');
      } else {
        formGroup.addControl('answers', this.fb.array([]));
        formGroup.removeControl('variants');
      }
    });
    console.log(this.taskForm.get('questions') as FormArray);
    this.cdRef.detectChanges();
  }

  public deleteQuestion(index: number) {
    (this.taskForm.get('questions') as FormArray).removeAt(index);
  }

  public getAnswersArray(question: FormGroup) {
    return question.get('answers') as FormArray;
  }

  public getVariantsArray(question: FormGroup) {
    return question.get('variants') as FormArray;
  }

  public addTask() {
    if (this.taskForm.invalid) {
      console.log(this.taskForm);
      this.taskForm.markAllAsTouched();
      return;
    }
    this.taskService.addTask(this.taskForm.getRawValue()).subscribe((response) => {
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
          id: source[key],
          name: source[key],
        });
      }
    });
    return result;
  }
}
