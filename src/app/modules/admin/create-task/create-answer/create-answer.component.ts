import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  @Input() public questionGroup: FormGroup;
  @Input() public questionIndex: number;
  @Input() public isVariant: boolean;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {}
  public getFormControl(form: FormGroup, controlName: string): FormControl {
    if (!form) {
      return null;
    }
    return form.get(controlName) as FormControl;
  }
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

  public openCreateModal(index, answer?: FormGroup) {
    const modal = this.modalService.open(ChangeAnswerModalComponent, {
      windowClass: 'modal-admin',
    });
    modal.componentInstance.answer = answer || this.getFormGroup();
    modal.result
      .then((resultAnswer: FormGroup) => {
        if (!answer) {
          this.addAnswer(resultAnswer);
        }
      })
      .catch(() => {});
  }

  private addSeveralAnswers(files: UploadFile[]): void {
    files.forEach((file) => {
      const formGroup = this.getFormGroup();
      formGroup.patchValue({
        image: file.file,
        imagePath: file.url,
      });
      this.addAnswer(formGroup);
    });
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

  public uploadFiles(event: MouseEvent): void {
    event.preventDefault();
    const fileInput = this.createUploadFileInput();
    document.querySelector('.answer-selector').append(fileInput);

    fileInput.addEventListener('change', () => {
      if (!fileInput.files?.length) {
        fileInput.remove();
        return;
      }
      this.readMultiFiles(Array.from(fileInput.files));

      fileInput.remove();
    });
    fileInput.click();
  }

  private readMultiFiles(files: File[]) {
    const result: UploadFile[] = [];
    const reader = new FileReader();
    const readFile = (index) => {
      if (index >= files.length) {
        this.addSeveralAnswers(result);
        return;
      }
      const file = files[index];
      reader.onload = (e) => {
        result.push({
          name: file.name,
          url: e.target?.result?.toString() || '',
          file,
        });

        readFile(index + 1);
      };
      reader.readAsDataURL(file);
    };
    readFile(0);
  }

  private createUploadFileInput(): HTMLInputElement {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <input hidden name="images" type="file" accept="image/*" multiple>
    `;

    return wrapper.firstElementChild as HTMLInputElement;
  }
}

export interface UploadFile {
  [name: string]: any;
  name: string;
  url: string;
  file?: File;
}
