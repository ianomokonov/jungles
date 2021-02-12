import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSliderComponent } from './feedback-slider.component';

describe('FeedbackSliderComponent', () => {
  let component: FeedbackSliderComponent;
  let fixture: ComponentFixture<FeedbackSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
