import { TaskQuestion } from './task-question';
import { TaskType } from './task-type.enum';

export interface Task {
  id: number;
  type: TaskType;
  questions: TaskQuestion[];
  allSolved?: boolean;
  isActive?: boolean;
  isSolvedIncorrectly?: boolean;
}
