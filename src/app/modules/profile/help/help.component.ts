import { Component } from '@angular/core';
import { Question } from '../../../models/question';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less'],
})
export class HelpComponent {
  public currentProblem: string;
  public questions: Question[] = [
    {
      question: 'Вопрос 1',
      answer: 'Ответ на часто задаваемый вопрос номер 1',
    },
    {
      question: 'Вопрос 2',
      answer: 'Ответ на часто задаваемый вопрос номер 2',
    },
    {
      question: 'Вопрос 3',
      answer: 'Ответ на часто задаваемый вопрос номер 3',
    },
    {
      question: 'Вопрос 4',
      answer: 'Ответ на часто задаваемый вопрос номер 4',
    },
    {
      question: 'Вопрос 5',
      answer: 'Ответ на часто задаваемый вопрос номер 5',
    },
  ];

  public problems: string[] = ['Тема 1', 'Тема 2', 'Тема 3'];

  public onSelectTopic(problem: string) {
    this.currentProblem = problem;
  }
}
