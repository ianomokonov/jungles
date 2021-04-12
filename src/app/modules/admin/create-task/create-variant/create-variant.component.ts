import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Answer } from 'src/app/models/answer';
import { TaskQuestion } from 'src/app/models/task-question';
import { Variant } from 'src/app/models/variant';

@Component({
  selector: 'app-create-variant',
  templateUrl: './create-variant.component.html',
  styleUrls: ['./create-variant.component.less'],
})
export class CreateVariantComponent {
  @Input() public question: TaskQuestion;
  @Input() public answersFormArray: FormArray;
  public answers: Answer[] = [];

  public addVariant() {
    this.question.variants.push({ name: 'Вариант', answers: [] } as Variant);
  }

  public deleteVariant(index: number) {
    this.question.variants.filter((variant) => variant.id !== index);
  }
}
