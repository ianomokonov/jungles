/* eslint-disable no-param-reassign */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';
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
  public tasks = [];
  public tasksNumbers: number[] = [];
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
    this.taskService.getShortTasks().subscribe((data: any) => {
      this.taskForm.get('number').setValue(data.length + 1);
      this.tasks = [...data, { id: null, number: data.length + 1 }];
    });
    this.taskForm = this.fb.group({
      type: [null, Validators.required],
      number: [null, Validators.required],
      questions: this.fb.array([]),
    });
    this.addQuestion();
  }

  public get questions(): FormGroup[] {
    return (this.taskForm.get('questions') as FormArray).controls as FormGroup[];
  }

  public addQuestion() {
    const questionForm = this.fb.group({
      name: [null, Validators.required],
      type: this.answerType.Choice,
      image: null,
      sound: null,
      imagePath: null,
      correctAnswerIndex: [null, Validators.required],
      answers: this.fb.array([]),
    });
    (this.taskForm.get('questions') as FormArray).push(questionForm);
    questionForm.get('type').valueChanges.subscribe((value) => {
      const correctAnswerIndexControl = questionForm.get('correctAnswerIndex');
      if (value === this.answerType.Variants) {
        questionForm.addControl(
          'variants',
          this.fb.array([
            this.fb.group({ name: [null, Validators.required], answers: this.fb.array([]) }),
          ]),
        );
        correctAnswerIndexControl.clearValidators();
        questionForm.removeControl('answers');
        return;
      }
      correctAnswerIndexControl.setValidators(Validators.required);
      questionForm.addControl('answers', this.fb.array([]));
      questionForm.removeControl('variants');
    });
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

  public setCorrectIndex(question: FormGroup, index) {
    question.get('correctAnswerIndex').setValue(index);
  }

  public savePath(question: FormGroup, path: string) {
    question.get('imagePath').setValue(path);
  }
  public addTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const formValue = this.taskForm.getRawValue();
    const resultValue = { type: formValue.type, questions: [], number: formValue.number };
    resultValue.questions = formValue.questions.map((question) => {
      const result = {
        name: question.name,
        type: question.type,
        answers: [],
        variants: [],
      };
      if (question.type === AnswerType.Choice) {
        result.answers = question.answers.map((answer, index) => {
          return {
            isCorrect: question.correctAnswerIndex === index,
            name: answer.name,
          };
        });
      } else {
        result.variants = question.variants.map((variant) => {
          return {
            answers: variant.answers.map((answer) => ({ name: answer.name })),
            name: variant.name,
          };
        });
      }
      return result;
    });
    this.taskService.addTask(resultValue).subscribe((questions) => {
      if (questions) {
        const subscriptions = [];
        questions.forEach((question, questionIndex) => {
          const curQuestion = formValue.questions[questionIndex];
          if (curQuestion.image) {
            subscriptions.push(this.taskService.addQuestionImage(question.id, curQuestion.image));
          }
          if (curQuestion.sound) {
            subscriptions.push(this.taskService.addQuestionSound(question.id, curQuestion.sound));
          }

          if (question.variants) {
            question.variants.forEach((variant, variantIndex) => {
              variant.answers.forEach((answerId, index) => {
                if (curQuestion.variants[variantIndex].answers[index].image) {
                  subscriptions.push(
                    this.taskService.addAnswerImage(
                      answerId,
                      curQuestion.variants[variantIndex].answers[index].image,
                    ),
                  );
                }
              });
            });

            return;
          }

          question.answers.forEach((answerId, index) => {
            if (curQuestion.answers[index].image) {
              subscriptions.push(
                this.taskService.addAnswerImage(
                  answerId,
                  formValue.questions[questionIndex].answers[index].image,
                ),
              );
            }
          });
        });
        if (!subscriptions?.length) {
          alert('Задание создано!');
          this.ngOnInit();
          return;
        }
        forkJoin(subscriptions).subscribe(() => {
          alert('Задание создано!');
          this.ngOnInit();
        });
      }
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
