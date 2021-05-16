import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public tasksNumbers: number[] = [];
  public selectedTaskQuestions: TaskQuestion[] = [];
  public selectedQuestion: TaskQuestion;
  constructor(private taskService: TaskService, private fb: FormBuilder) {}
  public filterForm: FormGroup;
  public questionForm: FormGroup;
  public answerForm: FormGroup;
  public answersForms: FormArray;

  public get answersFormsGroup() {
    return this.answersForms.controls as FormGroup[];
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      task: [null],
      question: [null],
    });
    this.filterForm.get('task').valueChanges.subscribe((event) => {
      this.selectedQuestion = null;
      this.selectedTaskQuestions = event;
    });
    this.filterForm.get('question').valueChanges.subscribe((event) => {
      this.selectedQuestion = event;
      this.questionForm = this.fb.group({
        name: [this.selectedQuestion.name, Validators.required],
        image: null,
        sound: null,
        answers: this.fb.array([]),
      });
      this.selectedQuestion.answers.forEach((answer) => {
        this.answerForm = this.fb.group({
          name: [answer.name, Validators.required],
          image: [null],
        });
        (this.questionForm.get('answers') as FormArray).push(this.answerForm);
      });
      this.answersForms = this.questionForm.get('answers') as FormArray;
    });
    this.taskService.getFullTasks().subscribe((data) => {
      this.tasks = data;
      this.tasks.forEach((task) => {
        this.tasksNumbers.push(task.number);
      });
      this.tasksNumbers.push(this.tasksNumbers[this.tasksNumbers.length - 1] + 1);
      this.tasksNumbers = this.tasksNumbers.sort((a, b) => b - a);
    });
  }

  public saveAnswer(answer: FormGroup) {
    if (answer.invalid) {
      answer.markAsTouched();
      return;
    }
    // айди вопроса?
    const answerData = answer.get('image').value
      ? { name: answer.get('name').value, image: answer.get('image').value }
      : { name: answer.get('name').value, image: answer.get('image').value, removeImage: '??????' };
    // this.taskService.updateAnswer(id, answerData);
  }

  public saveQuestion() {
    if (this.questionForm.invalid) {
      this.questionForm.markAsTouched();
    }
    // нужно обработать удаляются ли пикчи
    // this.taskService
    //   .updateQuestion(this.selectedQuestion.id, this.questionForm.getRawValue())
    //   .subscribe();
  }
}
