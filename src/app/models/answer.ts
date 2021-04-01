import { AnswerType } from './answer-type';

export interface Answer {
  id: number;
  name: string;
  image: string;
  type: AnswerType;
}
