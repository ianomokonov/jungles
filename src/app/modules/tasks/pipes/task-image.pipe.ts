import { Pipe, PipeTransform } from '@angular/core';
import { TaskType } from 'src/app/models/task-type.enum';

@Pipe({
  name: 'taskImage',
})
export class TaskImagePipe implements PipeTransform {
  public transform(value: TaskType): string {
    switch (value) {
      case TaskType.Creativity: {
        return 'pencil.png';
      }
      case TaskType.Logic: {
        return 'logic.png';
      }
      case TaskType.Grammatics: {
        return 'book.png';
      }
      case TaskType.Intellection: {
        return 'light.png';
      }
      default: {
        return '';
      }
    }
  }
}
