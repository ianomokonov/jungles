import { Pipe, PipeTransform } from '@angular/core';
import { AnswerType } from 'src/app/models/answer-type';

@Pipe({
  name: 'answerLabel',
})
export class AnswerLabelPipe implements PipeTransform {
  public transform(value: AnswerType): string {
    switch (value) {
      case AnswerType.Choice: {
        return 'C выбором ответа';
      }
      case AnswerType.Variants: {
        return 'С вариантами';
      }
      default: {
        return '';
      }
    }
  }
}
