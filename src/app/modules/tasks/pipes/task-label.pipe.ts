import { Pipe, PipeTransform } from '@angular/core';
import { TaskType } from 'src/app/models/task-type.enum';

@Pipe({
  name: 'taskLabel',
})
export class TaskLabelPipe implements PipeTransform {
  public transform(value: TaskType): string {
    switch (value) {
      case TaskType.Creativity: {
        return 'Креативность';
      }
      case TaskType.Logic: {
        return 'Логика';
      }
      case TaskType.Grammatics: {
        return 'Грамота';
      }
      default: {
        return '';
      }
    }
  }
}
