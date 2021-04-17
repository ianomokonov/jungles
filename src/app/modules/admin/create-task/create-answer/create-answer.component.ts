import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Answer } from 'src/app/models/answer';
import { ChangeAnswerModalComponent } from '../change-answer-modal/change-answer-modal.component';

@Component({
  selector: 'app-create-answer',
  templateUrl: './create-answer.component.html',
  styleUrls: ['./create-answer.component.less'],
})
export class CreateAnswerComponent {
  @ViewChild('image') private image: ElementRef<HTMLImageElement>;
  @Input() public answersFormArray: FormArray;
  @Input() public isVariant: boolean;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {}

  public get answersForms(): FormGroup[] {
    return this.answersFormArray.controls as FormGroup[];
  }

  public get answers(): Answer[] {
    return this.answersFormArray.value as Answer[];
  }

  public deleteAnswer(index: number) {
    this.answersFormArray.removeAt(index);
  }

  public getFormGroup(): FormGroup {
    return this.fb.group(
      {
        name: null,
        isCorrect: false,
        image: null,
        imagePath: null,
      },
      (formGroupParam: FormGroup) => {
        const value = formGroupParam.getRawValue();
        if (!value.image && !value.name) {
          return { noValue: true };
        }
        return null;
      },
    );
  }

  public addAnswer(data: FormGroup) {
    if (this.answersFormArray.controls.some((c) => c.invalid)) {
      this.answersFormArray.markAllAsTouched();
      return;
    }
    this.answersFormArray.push(data);
  }

  public openCreateModal() {
    const modal = this.modalService.open(ChangeAnswerModalComponent, {
      windowClass: 'modal-admin',
    });
    modal.componentInstance.answer = this.getFormGroup();
    modal.result
      .then((answer) => {
        this.addAnswer(answer);
      })
      .catch(() => {});
  }

  public openChangeModal(answer: FormGroup) {
    const modal = this.modalService.open(ChangeAnswerModalComponent, {
      windowClass: 'modal-admin',
    });
    modal.componentInstance.answer = answer;
  }

  public getPath(file: File, image: HTMLImageElement) {
    if (file) {
      const reader = new FileReader();

      reader.onload = ({ target }) => {
        // eslint-disable-next-line no-param-reassign
        image.src = target.result.toString();
      };

      reader.readAsDataURL(file);
    }
  }
}
