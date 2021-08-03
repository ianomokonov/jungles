import {
  Component,
  ElementRef,
  ViewChild,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
  ],
})
export class FileUploaderComponent implements ControlValueAccessor {
  @ViewChild('inputFileContainer') private inputFileContainer: ElementRef<HTMLDivElement>;
  @ViewChild('image') private image: ElementRef<HTMLImageElement>;
  @Input() public isSound: boolean;
  @Input() public placeholder: string;
  @Input() public imagePath: string;

  @Output() public path: EventEmitter<string> = new EventEmitter();
  @Output() public remove: EventEmitter<void> = new EventEmitter();

  public value: File;
  public audio;

  public disabled: boolean;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (value: any) => {};
  private onTouched = () => {};

  public getSoundName() {
    if (this.value) {
      return this.value.name;
    }

    if (!this.imagePath) {
      return null;
    }

    const steps = this.imagePath.split('_');
    steps.splice(0, 1);

    return steps.join('_');
  }

  /*
    Value Accessor
  */
  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public writeValue(out: File) {
    this.value = out;
  }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public updateValue(value: File) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  public onRemoveFileClick(event: MouseEvent): void {
    event.preventDefault();
    this.updateValue(null);
    this.imagePath = null;
    this.remove.emit();
  }

  public onUploadFileClick(event: MouseEvent): void {
    event.preventDefault();
    const fileInput = this.createUploadFileInput();
    this.inputFileContainer.nativeElement.append(fileInput);

    fileInput.addEventListener('change', (eventF) => {
      const file = (eventF.target as HTMLInputElement).files[0];
      const reader = new FileReader();

      reader.onload = ({ target }) => {
        const path = target.result.toString();

        this.imagePath = path;
        this.path.emit(path);
      };

      reader.readAsDataURL(file);

      this.updateValue(file);

      fileInput.remove();
    });

    fileInput.click();
  }

  public play(file) {
    if (this.isSound) {
      this.audio = new Audio(file);

      this.audio.play();
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  public getSrc() {
    return this.imagePath || this.value;
  }

  private createUploadFileInput(): HTMLInputElement {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <input hidden name="images" type="file" accept="${this.isSound ? 'audio/*' : 'image/*'}">
    `;

    return wrapper.firstElementChild as HTMLInputElement;
  }
}
