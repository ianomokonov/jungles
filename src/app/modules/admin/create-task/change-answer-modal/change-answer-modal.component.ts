import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getImagePath } from 'src/app/modules/shared/utils';

@Component({
  selector: 'app-change-answer-modal',
  templateUrl: './change-answer-modal.component.html',
  styleUrls: ['./change-answer-modal.component.less'],
})
export class ChangeAnswerModalComponent implements OnInit {
  public answer: FormGroup;
  public index: number;

  constructor(private fb: FormBuilder, public modal: NgbActiveModal) {}

  ngOnInit(): void {
    console.log(this.answer);
  }

  public changeAnswer() {
    this.modal.close(this.answer);
  }

  public savePath(path) {
    this.answer.patchValue({ imagePath: path }, { emitEvent: false });
  }
}
