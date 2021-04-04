import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from 'src/app/models/answer';
import { AnswerType } from 'src/app/models/answer-type';
import { Task } from 'src/app/models/task';
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
    if (isDone) {
      return;
    }
    this.choosedAnswerId = answerId;
  }

  public checkAnswer(type: AnswerType) {
    if (type === AnswerType.Choice) {
      this.taskService
        .checkAnswer(this.choosedAnswerId, this.userService.activeChild?.id)
        .subscribe(() => {
          this.getTask(this.task.id);
        });
    }
  }

  private getTask(id: number) {
    this.task = null;
    this.taskService.getTask(id, this.userService.activeChild?.id).subscribe((task) => {
      task.questions.forEach((questionTemp) => {
        const question = questionTemp;
        question.childAnswers.forEach((answer) => {
          const questionAnswer = question.answers.find((a) => a.id === answer.answerId);
          if (answer.isCorrect) {
            questionAnswer.isCorrect = true;
            question.isDone = true;
            return;
          }

          questionAnswer.isIncorrect = true;
          question.isFailed = true;
        });
      });
      this.task = task;
    });
  }
}
