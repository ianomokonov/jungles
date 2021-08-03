import { TaskQuestion } from './task-question';
import { TaskType } from './task-type.enum';

export interface Task {
  id: number;
  type: TaskType;
  number: number;
  questions: TaskQuestion[];
  questionsCount: number;
  allSolved?: boolean;
  isActive?: boolean;
  isSolvedIncorrectly?: boolean;
}
