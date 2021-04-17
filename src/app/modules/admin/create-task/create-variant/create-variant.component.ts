import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Variant } from 'src/app/models/variant';

@Component({
  selector: 'app-create-variant',
  templateUrl: './create-variant.component.html',
  styleUrls: ['./create-variant.component.less'],
})
export class CreateVariantComponent {
  @Input() public variantsFormArray: FormArray;

  constructor(private fb: FormBuilder) {}

  public get variantsForms(): FormGroup[] {
    return this.variantsFormArray.controls as FormGroup[];
  }

  public get variants(): Variant[] {
    return this.variantsFormArray.value as Variant[];
  }

  public addVariant() {
    const formGroup = this.fb.group({
      name: null,
      answers: this.fb.array([]),
    });
    if (this.variants?.length > 0) {
      if (!this.variants[this.variants.length - 1].answers.length) {
        this.variants[this.variants.length - 1].isNull = true;
        return;
      }
      this.variants[this.variants.length - 1].isNull = false;
      this.variantsFormArray.push(formGroup);
      return;
    }
    this.variantsFormArray.push(formGroup);
  }

  public deleteVariant(index: number) {
    this.variantsFormArray.removeAt(index);
  }

  public getAnswersArray(variant: FormGroup) {
    return variant.get('answers') as FormArray;
  }
}
