import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class ChangeTaskComponent implements OnInit {
  public tasks: Task[];
  public answerType = AnswerType;
  public selectedTask: Task;
  public tasksNumbers: number[] = [];
  public selectedTaskQuestions: TaskQuestion[] = [];
  public selectedQuestion: TaskQuestion;
  constructor(private taskService: TaskService, private fb: FormBuilder) {}
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
    this.filterForm = this.fb.group({
      task: [null],
      question: [null],
      number: [null],
    });
    this.filterForm.get('task').valueChanges.subscribe((event) => {
      this.selectedQuestion = null;
      this.selectedTask = event;
      this.selectedTaskQuestions = event.questions;
    });
    this.filterForm.get('question').valueChanges.subscribe((event) => {
      this.selectedQuestion = event;
      this.questionForm = this.fb.group({
        name: [this.selectedQuestion.name, Validators.required],
        image: null,
        sound: null,
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
    this.taskService.getFullTasks().subscribe((data) => {
      this.tasks = data;
      this.tasks.forEach((task) => {
        this.tasksNumbers.push(task.number);
      });
      this.tasksNumbers = this.tasksNumbers.sort((a, b) => b - a);
    });
  }

  public createAnswerGroup(array: Answer[], form: FormGroup) {
    array.forEach((answer) => {
      this.answerForm = this.fb.group({
        id: [answer.id],
        name: [answer.name, Validators.required],
        image: [null],
      });
      (form.get('answers') as FormArray).push(this.answerForm);
    });
    this.answersForms = this.questionForm.get('answers') as FormArray;
    return this.answersForms;
  }

  public saveTask() {
    if (!this.selectedTask && this.selectedTask.number === this.filterForm.get('number').value) {
      return;
    }
    this.taskService
      .updateTask(this.selectedTask.id, { number: this.filterForm.get('number').value })
      .subscribe((response) => {
        if (response) {
          this.ngOnInit();
        }
      });
  }

  public saveAnswer(answer: FormGroup) {
    if (answer.invalid) {
      answer.markAsTouched();
      return;
    }
    const answerData = answer.get('image').value
      ? { name: answer.get('name').value, image: answer.get('image').value }
      : {
          name: answer.get('name').value,
          image: answer.get('image').value,
          removeImage: answer.get('image').value,
        };
    this.taskService.updateAnswer(answer.get('id').value, answerData);
  }

  public saveVariant(variant: FormGroup) {
    if (variant.invalid) {
      variant.markAsTouched();
      return;
    }
    this.taskService
      .updateVariant(variant.get('id'), { name: variant.get('name') })
      .subscribe((response) => {
        if (response) {
          this.ngOnInit();
        }
      });
  }

  public saveQuestion() {
    if (this.questionForm.invalid) {
      this.questionForm.markAsTouched();
      return;
    }
    const questionData = this.questionForm.get('image').value
      ? { name: this.questionForm.get('name').value, image: this.questionForm.get('image').value }
      : {
          name: this.questionForm.get('name').value,
          image: this.questionForm.get('image').value,
          removeImage: this.selectedQuestion.image,
        };
    // нужно также обработать звук?
    this.taskService
      .updateQuestion(this.selectedQuestion.id, questionData)
      .subscribe((response) => {
        if (response) {
          this.ngOnInit();
        }
      });
  }
}
