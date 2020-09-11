import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfCheckInFeedbackComponent } from './self-check-in-feedback.component';

describe('SelfCheckInFeedbackComponent', () => {
  let component: SelfCheckInFeedbackComponent;
  let fixture: ComponentFixture<SelfCheckInFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfCheckInFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfCheckInFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
