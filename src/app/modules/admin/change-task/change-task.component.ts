import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Answer } from 'src/app/models/answer';
import { AnswerType } from 'src/app/models/answer-type';
import { Task } from 'src/app/models/task';
import { TaskQuestion } from 'src/app/models/task-question';
import { TaskService } from 'src/app/services/backend/task.service';

@Component({
  selector: 'app-change-task',
  templateUrl: './change-task.component.html',
  styleUrls: ['./change-task.component.less'],
})
export class ChangeTaskComponent implements OnInit, OnDestroy {
  private rxAlive = true;
  public tasks: Task[];
  public answerType = AnswerType;
  public selectedTask: Task;
  public selectedTaskQuestions: TaskQuestion[] = [];
  public selectedQuestion: TaskQuestion;
  public deletedImgs = new Set();

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      task: [null],
      question: [null],
      number: [null],
    });
    const questionControl = this.filterForm.get('question');
    this.filterForm.get('task').valueChanges.subscribe((event) => {
      this.selectedQuestion = null;
      this.selectedTask = event;

      this.selectedTaskQuestions = event?.questions;
      questionControl.setValue(null);
      this.filterForm.get('number').setValue(event?.number);
    });
    questionControl.valueChanges.subscribe((event) => {
      this.selectedQuestion = event;
      if (!event) {
        return;
      }
      this.questionForm = this.fb.group({
        name: [this.selectedQuestion.name, Validators.required],
        image: null,
        sound: null,
        imagePath: [this.selectedQuestion.image],
        soundPath: [this.selectedQuestion.sound],
        answers: this.fb.array([]),
      });
      this.createAnswerGroup(this.selectedQuestion.answers, this.questionForm);
      if (this.selectedQuestion.type === this.answerType.Variants) {
        this.questionForm.addControl('variants', this.fb.array([]));
        this.selectedQuestion.variants.forEach((variant) => {
          (this.questionForm.get('variants') as FormArray).push(
            this.fb.group({ id: [variant.id], name: [variant.name] }),
          );
        });
        this.variantsForms = this.questionForm.get('variants') as FormArray;
      }
    });
  }

  public filterForm: FormGroup;
  public questionForm: FormGroup;
  public answerForm: FormGroup;
  public answersForms: FormArray;
  public variantForm: FormGroup;
  public variantsForms: FormArray;

  public get answersFormsGroup() {
    return this.answersForms.controls as FormGroup[];
  }

  public get variantsFormsGroup() {
    return this.variantsForms.controls as FormGroup[];
  }

  ngOnInit(): void {
    this.taskService
      .getAdminTasks()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((data) => {
        this.tasks = data;
      });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public createAnswerGroup(array: Answer[], form: FormGroup) {
    array.forEach((answer) => {
      this.answerForm = this.fb.group(
        {
          id: [answer.id],
          name: [answer.name],
          image: null,
          imagePath: [answer.image],
        },
        // eslint-disable-next-line @typescript-eslint/unbound-method
        { validators: [this.hasNameOrImage] },
      );
      (form.get('answers') as FormArray).push(this.answerForm);
    });
    this.answersForms = this.questionForm.get('answers') as FormArray;
    return this.answersForms;
  }

  private hasNameOrImage(formGroup: FormGroup): { [name: string]: boolean } {
    const { name, image, imagePath } = formGroup.getRawValue();
    if (!name && !image && !imagePath) {
      return { shouldHaveNameOrImage: true };
    }

    return null;
  }

  public saveTask() {
    if (!this.selectedTask && this.selectedTask.number === this.filterForm.get('number').value) {
      return;
    }
    this.taskService
      .updateTask(this.selectedTask.id, { number: this.filterForm.get('number').value })
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(
        () => {
          alert('Задача успешно изменена!');
          this.taskService.getShortTasks().subscribe((tasks) => {
            tasks.forEach((t) => {
              const ta = this.tasks.find((task) => task.id === t.id);
              if (ta) {
                ta.number = t.number;
              }
            });
            this.tasks = this.tasks.sort((a, b) => a.number - b.number).slice();
            this.filterForm.patchValue({
              number: this.selectedTask.number,
            });
          });
        },
        (err) => {
          console.log(err);
        },
      );
  }

  public onRemoveFile(path) {
    if (path) {
      this.deletedImgs.add(path);
    }
  }

  public saveAnswer(answer: FormGroup) {
    if (answer.invalid) {
      answer.markAsTouched();
      return;
    }
    const formValue = answer.getRawValue();
    const answerData: { [name: string]: string } = { name: formValue.name };
    const subscriptions: Observable<any>[] = [];
    const hasImgToRemove = this.deletedImgs.has(formValue.imagePath);
    if (hasImgToRemove) {
      answerData.removeImg = formValue.imagePath;
    }
    if (formValue.image) {
      subscriptions.push(this.taskService.addAnswerImage(formValue.id, formValue.image));
    }
    subscriptions.push(this.taskService.updateAnswer(formValue.id, answerData));
    forkJoin(subscriptions)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(
        ([imagePath]) => {
          alert('Ответ успешно изменён!');
          if (hasImgToRemove) {
            this.deletedImgs.delete(formValue.imagePath);
          }
          if (formValue.image) {
            answer.patchValue({ image: null, imagePath });
          }
        },
        (err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        },
      );
  }

  public saveVariant(variant: FormGroup) {
    if (variant.invalid) {
      variant.markAsTouched();
      return;
    }

    const { id, name } = variant.getRawValue();
    this.taskService
      .updateVariant(id, { name })
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(
        () => {
          alert('Вариант успешно изменён!');
        },
        (err) => {
          console.log(err);
        },
      );
  }

  public saveQuestion() {
    if (this.questionForm.invalid) {
      this.questionForm.markAsTouched();
      return;
    }

    const formValue = this.questionForm.getRawValue();
    const questionData: { [name: string]: string } = { name: formValue.name };
    const subscriptions: Observable<any>[] = [];
    const hasImgToRemove = this.deletedImgs.has(formValue.imagePath);
    const hasSoundToRemove = this.deletedImgs.has(formValue.soundPath);
    if (hasImgToRemove) {
      questionData.removeImg = formValue.imagePath;
    }
    if (formValue.image) {
      subscriptions.push(
        this.taskService.addQuestionImage(this.selectedQuestion.id, formValue.image),
      );
    }
    if (hasSoundToRemove) {
      questionData.removeSound = formValue.soundPath;
    }
    if (formValue.sound) {
      subscriptions.push(
        this.taskService.addQuestionSound(this.selectedQuestion.id, formValue.sound),
      );
    }
    subscriptions.push(this.taskService.updateQuestion(this.selectedQuestion.id, questionData));

    forkJoin(subscriptions)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(
        ([firstParam, secondParam]) => {
          alert('Вопрос успешно изменён!');
          if (hasImgToRemove) {
            this.deletedImgs.delete(formValue.imagePath);
          }
          if (hasSoundToRemove) {
            this.deletedImgs.delete(formValue.soundPath);
          }

          const data: any = {};
          if (formValue.image) {
            data.image = null;
            data.imagePath = firstParam;

            if (formValue.sound) {
              data.sound = null;
              data.soundPath = secondParam;
              this.questionForm.patchValue(data);
              return;
            }
          }

          if (formValue.sound) {
            data.sound = null;
            data.soundPath = firstParam;
            this.questionForm.patchValue(data);
          }
        },
        (err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        },
      );
  }
}
