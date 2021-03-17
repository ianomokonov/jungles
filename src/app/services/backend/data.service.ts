import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question } from 'src/app/models/question';
import { environment } from 'src/environments/environment';

@Injectable()
export class DataService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getQuestions(): Observable<Question[]> {
    // return this.http.get<Question[]>(`${this.baseUrl}/get-questions`);
    return of([
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
    ]);
  }
}
