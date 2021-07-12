import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDiscountComponent } from './set-discount.component';

describe('SetDiscountComponent', () => {
  let component: SetDiscountComponent;
  let fixture: ComponentFixture<SetDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
