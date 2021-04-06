import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Answer } from 'src/app/models/answer';
import { AnswerType } from 'src/app/models/answer-type';
import { Task } from 'src/app/models/task';
import { TaskQuestion } from 'src/app/models/task-question';
import { TasksInfo } from 'src/app/models/tasks-info';
import { TaskService } from 'src/app/services/backend/task.service';
import { TokenService } from 'src/app/services/backend/token.service';
import { UserService } from 'src/app/services/backend/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less'],
})
export class TaskComponent {
  public answerType = AnswerType;
  public choosedAnswerId: number;
  public task: Task;
  public activeQuestion: TaskQuestion;
  public showCurrentAnswer = false;
  public tasksInfo: TasksInfo;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
  ) {
    if (this.tokenService.getAuthToken()) {
      this.userService.userLoaded$.subscribe((user) => {
        if (!user) {
          return;
        }
        this.activatedRoute.params.subscribe((params) => {
          if (params.id) {
            this.getTask(params.id);
          }
        });
      });
    }
  }

  public drop(event: CdkDragDrop<Answer[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  public choose(answerId: number, isDone: boolean) {
    if (isDone || this.showCurrentAnswer) {
      return;
    }
    this.choosedAnswerId = answerId;
  }

  public solveAgain() {
    this.showCurrentAnswer = null;
  }

  public onQuestionChanged(event) {
    console.log(event);
  }

  public nextQuestion() {
    this.showCurrentAnswer = false;
    const nextIndex =
      this.task.questions.findIndex((question) => question.id === this.activeQuestion.id) + 1;
    if (nextIndex < this.task.questions.length) {
      this.activeQuestion = this.task.questions[nextIndex];
      return;
    }

    this.router.navigate(['/tasks']);
  }

  public checkAnswer(type: AnswerType) {
    if (!this.choosedAnswerId) {
      alert('Выберите ответ!');
      return;
    }
    if (type === AnswerType.Choice) {
      this.taskService
        .checkAnswer(
          this.choosedAnswerId,
          this.userService.activeChild?.id,
          this.activeQuestion.childAnswers?.length
            ? this.activeQuestion.childAnswers[0].id
            : undefined,
        )
        .subscribe(() => {
          this.showCurrentAnswer = true;
          this.choosedAnswerId = null;
          this.getTask(this.task.id);
        });
    }
  }

  public getQuestionName(question: TaskQuestion, index: number): string {
    if (!this.showCurrentAnswer) {
      return index.toString();
    }

    if (question.isDone) {
      return 'Правильно!';
    }

    if (question.isFailed) {
      return 'Неправильно!';
    }

    return index.toString();
  }

  private getTask(id: number) {
    this.task = null;
    this.activeQuestion = null;
    let correctQuestion = null;
    forkJoin([
      this.taskService.getTask(id, this.userService.activeChild?.id),
      this.taskService.getTasksInfo(this.userService.activeChild?.id),
    ]).subscribe(([task, info]) => {
      this.tasksInfo = info;
      task.questions.forEach((questionTemp) => {
        const question = questionTemp;
        question.childAnswers.forEach((answer) => {
          const questionAnswer = question.answers.find((a) => a.id === answer.answerId);
          if (answer.isCorrect) {
            questionAnswer.isCorrect = true;
            question.isDone = true;
            if (this.showCurrentAnswer) {
              correctQuestion = question;
            }
            return;
          }

          if (!this.activeQuestion) {
            this.activeQuestion = question;
          }
          questionAnswer.isIncorrect = true;
          question.isFailed = true;
        });
        if (!question.isDone && !this.activeQuestion) {
          this.activeQuestion = correctQuestion || question;
        }
      });
      this.task = task;
    });
  }
}
