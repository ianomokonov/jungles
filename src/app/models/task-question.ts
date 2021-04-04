import { Answer } from './answer';
import { AnswerType } from './answer-type';
import { ChildAnswer } from './child-answer';
import { Variant } from './variant';

export interface TaskQuestion {
  id: number;
  name: string;
  taskId?: number;
  cristalsCount: number;
  image?: string;
  answers: Answer[];
  childAnswers: ChildAnswer[];
  variants?: Variant[];
  isDone?: boolean;
  isFailed?: boolean;

  type: AnswerType;
}
