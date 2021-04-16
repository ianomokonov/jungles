import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAnswerModalComponent } from './change-answer-modal.component';

describe('ChangeAnswerModalComponent', () => {
  let component: ChangeAnswerModalComponent;
  let fixture: ComponentFixture<ChangeAnswerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAnswerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAnswerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
