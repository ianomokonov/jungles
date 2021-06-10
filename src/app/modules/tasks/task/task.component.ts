import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
export class TaskComponent implements OnDestroy {
  public answerType = AnswerType;
  public choosedAnswerId: number;
  public task: Task;
  public activeId: number;
  public showCurrentAnswer = false;
  public tasksInfo: TasksInfo;
  public taskLoading = false;
  public audio: HTMLAudioElement;
  public set activeQuestion(question: TaskQuestion) {
    this.activeId = question?.id;
    if (question) {
      this.activeQuestionPrivate = question;
    }
  }

  public get activeQuestion(): TaskQuestion {
    return this.activeQuestionPrivate;
  }

  public activeQuestionPrivate: TaskQuestion;
  private allSolved = true;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private cdRef: ChangeDetectorRef,
  ) {
    if (this.tokenService.getAuthToken()) {
      this.userService.userLoaded$.subscribe((user) => {
        if (!user) {
          return;
        }
        this.activatedRoute.params.subscribe((params) => {
          if (params.id) {
            this.getTask(params.id, true).subscribe();
          }
        });
      });
      return;
    }
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.getTask(params.id, true).subscribe();
      }
    });
  }

  public ngOnDestroy(): void {
    this.stop();
  }

  public changeTab(event) {
    this.activeQuestion = this.task.questions.find((q) => q.id === +event.nextId);
    if (this.activeQuestion.isDone) {
      this.activeQuestion.isDone = false;
    }
    this.showCurrentAnswer = false;
  }

  public drop(eventTemp: CdkDragDrop<Answer[]>) {
    const event = eventTemp;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousContainer.data.findIndex((d) => d.id === event.item.data?.id),
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
    this.showCurrentAnswer = false;
    this.choosedAnswerId = null;
  }

  public nextQuestion() {
    this.showCurrentAnswer = false;
    this.choosedAnswerId = null;
    const nextIndex =
      this.task.questions.findIndex((question) => question.id === this.activeQuestion.id) + 1;
    if (nextIndex < this.task.questions.length) {
      this.activeQuestion = this.task.questions[nextIndex];
      this.activeQuestion.isDone = false;
      if (this.activeQuestion.sound) {
        this.play(this.activeQuestion.sound);
      }
      return;
    }
    const nextQuestion = this.task.questions.find((q) => q.isFailed || !q.childAnswer);

    if (nextQuestion) {
      this.activeQuestion = nextQuestion;
      this.activeQuestion.isDone = false;
      if (this.activeQuestion.sound) {
        this.play(this.activeQuestion.sound);
      }
      return;
    }
    this.router.navigate(['/tasks']);
  }

  public checkAnswer(type: AnswerType) {
    if (this.taskLoading) {
      return;
    }
    if (!this.choosedAnswerId && this.activeQuestion.answers?.length) {
      // eslint-disable-next-line no-alert
      alert('Выберите ответ!');
      return;
    }
    if (type === AnswerType.Choice) {
      this.taskLoading = true;
      this.taskService
        .checkAnswer(
          this.choosedAnswerId,
          this.userService.activeChild?.id,
          this.activeQuestion.childAnswer?.id,
        )
        .subscribe((result) => {
          this.getTaskInfoRequest().subscribe((info) => {
            this.tasksInfo = info;
            this.activeQuestion.isDone = result.isCorrect;
            this.activeQuestion.isFailed = !result.isCorrect;
            if (!this.activeQuestion.childAnswer) {
              this.activeQuestion.childAnswer = {
                answerId: this.choosedAnswerId,
                id: result.childAnswerId,
                isCorrect: result.isCorrect,
                isSolved: false,
                tryCount: 0,
              };
            }

            this.showCurrentAnswer = true;
            this.taskLoading = false;
            if (result.isCorrect) {
              this.play('../../../../assets/sounds/pravilno.mp3');
              this.activeQuestion.childAnswer.tryCount = 0;
              return;
            }
            this.activeQuestion.childAnswer.tryCount += 1;
          });
        });
    }

    // const variants = [];

    // this.activeQuestion.variants.forEach((v) => {
    //   variants.push(
    //     ...v.answers.map((a) => ({
    //       id: a.id,
    //       variantId: v.id,
    //       childAnswerId:
    //         this.activeQuestion.childAnswers?.find((ca) => ca.answerId === a.id)?.id || undefined,
    //     })),
    //   );
    // });
    // this.taskService.checkVariants(variants, this.userService.activeChild?.id).subscribe(() => {
    //   this.getTask(this.task.id).subscribe(() => {
    //     this.showCurrentAnswer = true;
    //   });
    // });
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

  public hasImages(answers) {
    return answers.some((a) => a.image);
  }

  private onAudioEnded = () => {
    this.stop();
  };

  public play(file) {
    if (this.audio) {
      this.stop();
    }
    this.audio = new Audio(file);
    this.audio.play();
    this.audio.addEventListener('ended', this.onAudioEnded);
  }

  public stop() {
    if (!this.audio) {
      return;
    }
    this.audio.pause();
    this.audio.removeEventListener('ended', this.onAudioEnded);
    this.audio = null;
  }

  private getTask(id: number, playSound = false) {
    this.taskLoading = true;
    return forkJoin(this.getTaskRequests(id)).pipe(
      tap(([task, info]) => {
        this.tasksInfo = info;
        this.task = task;
        this.task.questions = this.getTaskQuestions(this.task.questions);
        this.setActiveQuestion();
        if (playSound && this.activeQuestion.sound) {
          this.play(this.activeQuestion.sound);
        }
        this.taskLoading = false;
      }),
    );
  }

  private getTaskRequests(id: number): [Observable<Task>, Observable<TasksInfo>] {
    if (this.userService.activeChild?.id) {
      return [
        this.taskService.getTask(id, this.userService.activeChild?.id),
        this.taskService.getTasksInfo(this.userService.activeChild?.id),
      ];
    }

    return [this.taskService.getUnregTask(id), this.taskService.getUnregTasksInfo()];
  }

  private getTaskInfoRequest(): Observable<TasksInfo> {
    if (this.userService.activeChild?.id) {
      return this.taskService.getTasksInfo(this.userService.activeChild?.id);
    }

    return this.taskService.getUnregTasksInfo();
  }

  private getTaskQuestions(questions: TaskQuestion[]) {
    const result = questions.map((question) => {
      const lastAnswerCorrect = !!question.childAnswer?.isCorrect;
      this.allSolved = this.allSolved && lastAnswerCorrect;
      return {
        ...question,
        isDone: lastAnswerCorrect,
        isFailed: question.childAnswer && !lastAnswerCorrect,
      };
    });

    if (this.allSolved) {
      const activeIndex = result.findIndex((r) => r.id === this.activeQuestion?.id);
      result.forEach((q, index) => {
        if (activeIndex > -1 && index <= activeIndex) {
          return;
        }
        const question = q;
        question.isDone = false;
      });
    }

    return result;
  }

  private setActiveQuestion() {
    const newActiveQuestion = this.task.questions.find(
      (question) => question.id === this.activeQuestion?.id,
    );

    if (
      this.showCurrentAnswer &&
      newActiveQuestion &&
      this.activeQuestion.isDone !== newActiveQuestion.isDone
    ) {
      this.activeQuestion = newActiveQuestion;
      return;
    }
    if (this.task.questions.every((q) => q.isDone)) {
      [this.activeQuestion] = this.task.questions;
      return;
    }

    this.activeQuestion = this.task.questions.find(
      (question) => question.isFailed || (!question.isFailed && !question.isDone),
    );
  }
}
