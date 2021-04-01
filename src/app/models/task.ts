import { TaskQuestion } from './task-question';
import { TaskType } from './task-type.enum';

export interface Task {
  id: number;
  type: TaskType;
  questions: TaskQuestion[];
  isActive?: boolean;
  isSolved?: boolean;
  isSolvedIncorrectly?: boolean;
}
