import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-answer-modal',
  templateUrl: './change-answer-modal.component.html',
  styleUrls: ['./change-answer-modal.component.less'],
})
export class ChangeAnswerModalComponent {
  public answer: FormGroup;

  constructor(private fb: FormBuilder, public modal: NgbActiveModal) {}

  public saveAnswer() {
    if (!this.answer.get('name').value || !this.answer.get('image').value) {
      return;
    }
    this.modal.close(this.answer);
  }

  public savePath(path) {
    this.answer.patchValue({ imagePath: path }, { emitEvent: false });
  }
}
