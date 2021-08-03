import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTaskComponent } from './remove-task.component';

describe('RemoveTaskComponent', () => {
  let component: RemoveTaskComponent;
  let fixture: ComponentFixture<RemoveTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
