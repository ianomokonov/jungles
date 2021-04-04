import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Answer } from 'src/app/models/answer';
import { AnswerType } from 'src/app/models/answer-type';
import { TaskQuestion } from 'src/app/models/task-question';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less'],
})
export class TaskComponent {
  public answerType = AnswerType;

  public questions: TaskQuestion[] = [
    {
      id: 1,
      name: 'Вопрос 1',
      cristalsCount: 1,
      childAnswers: [],
      type: AnswerType.Choice,
      answers: [
        {
          id: 1,
          name: 'Ответ 1',
        },
        {
          id: 2,
          name: 'Ответ 2',
        },
        {
          id: 3,
          name: 'Ответ 3',
        },
      ],
    },
    {
      id: 2,
      name: 'Вопрос 2',
      cristalsCount: 1,
      childAnswers: [],
      type: AnswerType.Variants,
      answers: [
        {
          id: 4,
          name: 'Ответ 1',
        },
        {
          id: 5,
          name: 'Ответ 2',
        },
        {
          id: 6,
          name: 'Ответ 3',
        },
        {
          id: 11,
          name: 'Ответ 4',
        },
        {
          id: 12,
          name: 'Ответ 5',
        },
        {
          id: 13,
          name: 'Ответ 6',
        },
      ],
      variants: [
        {
          id: 1,
          name: 'Столбец 1',
          answers: [],
        },
        {
          id: 2,
          name: 'Столбец 2',
          answers: [],
        },
      ],
    },
    {
      id: 3,
      name: 'Вопрос 3',
      cristalsCount: 1,
      childAnswers: [],
      type: AnswerType.Choice,
      answers: [
        {
          id: 7,
          name: 'Ответ 1',
        },
        {
          id: 8,
          name: 'Ответ 2',
        },
        {
          id: 9,
          name: 'Ответ 3',
        },
        {
          id: 10,
          name: 'Ответ 4',
        },
      ],
    },
  ];

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

  private getVariantId(variant: string) {
    return +variant.split('variant-')[1];
  }
}
