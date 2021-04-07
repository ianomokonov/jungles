import { Answer } from './answer';
import { ChildAnswer } from './child-answer';

export interface TaskQuestion {
  id: number;
  name: string;
  taskId: number;
  cristalsCount: number;
  image: string;
  answers: Answer[];
  childAnswers?: ChildAnswer[];
}
