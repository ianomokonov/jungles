import { Component, ElementRef, ViewChild, forwardRef, Input } from '@angular/core';
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
  @Input() public type: number;
  @Input() public placeholder: string;

  public value: File;
  public disabled: boolean;

  private onChange = (value: any) => {};
  private onTouched = () => {};

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
  }

  public onUploadFileClick(event: MouseEvent): void {
    event.preventDefault();
    const fileInput = this.createUploadFileInput();
    this.inputFileContainer.nativeElement.append(fileInput);

    fileInput.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files[0];
      const reader = new FileReader();

      reader.onload = ({ target }) => {
        this.image.nativeElement.src = target.result.toString();
      };

      reader.readAsDataURL(file);
      this.updateValue(file);

      fileInput.remove();
    });

    fileInput.click();
  }

  private createUploadFileInput(): HTMLInputElement {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <input hidden name="images" type="file" accept="image/*">
    `;

    return wrapper.firstElementChild as HTMLInputElement;
  }
}
