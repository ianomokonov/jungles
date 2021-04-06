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

  public drop(eventTemp: CdkDragDrop<Answer[]>) {
    const event = eventTemp;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      event.container.data[event.currentIndex].isCorrect = false;
      event.container.data[event.currentIndex].isIncorrect = false;
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
    if (!this.choosedAnswerId && this.activeQuestion.answers?.length) {
      // eslint-disable-next-line no-alert
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

      return;
    }

    const variants = [];

    this.activeQuestion.variants.forEach((v) => {
      variants.push(
        ...v.answers.map((a) => ({
          id: a.id,
          variantId: v.id,
          childAnswerId:
            this.activeQuestion.childAnswers?.find((ca) => ca.answerId === a.id)?.id || undefined,
        })),
      );
    });

    this.taskService.checkVariants(variants, this.userService.activeChild?.id).subscribe(() => {
      this.showCurrentAnswer = true;
      this.getTask(this.task.id);
    });
  }

  public getQuestionName(question: TaskQuestion, index: number): string {
    if (!this.showCurrentAnswer || question.id !== this.activeQuestion.id) {
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
      task.questions.forEach((questionTemp, index) => {
        const question = questionTemp;
        question.variants.forEach((variantTemp) => {
          const variant = variantTemp;
          variant.answers = [];
        });
        if (!question.childAnswers?.length) {
          if (!this.activeQuestion) {
            this.activeQuestion = correctQuestion || question;
          }
          return;
        }
        let hasErrors = false;
        question.childAnswers.forEach((childAnswerTemp) => {
          const childAnswer = childAnswerTemp;
          const questionAnswerIndex = question.answers.findIndex(
            (a) => a.id === childAnswer.answerId,
          );
          const questionAnswer = question.answers[questionAnswerIndex];
          const answerVariant = question.variants.find((v) => v.id === childAnswer.variantId);
          if (childAnswer.isCorrect) {
            questionAnswer.isCorrect = true;
          } else {
            questionAnswer.isIncorrect = true;
          }

          if (answerVariant) {
            answerVariant.answers.push(questionAnswer);
            question.answers.splice(questionAnswerIndex, 1);
          }
          if (!hasErrors) {
            hasErrors = !childAnswer.isCorrect;
          }
        });

        if (hasErrors && !this.activeQuestion) {
          this.activeQuestion = question;
        }
        if (!hasErrors && this.showCurrentAnswer) {
          correctQuestion = question;
        }

        question.isDone = !hasErrors;
        question.isFailed = hasErrors;

        if (index === task.questions.length - 1 && !this.activeQuestion) {
          this.activeQuestion = question;

          if (question.isDone) {
            this.showCurrentAnswer = true;
          }
        }
      });
      this.task = task;
    });
  }
}
