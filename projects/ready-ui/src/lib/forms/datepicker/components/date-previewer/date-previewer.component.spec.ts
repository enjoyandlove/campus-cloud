import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePreviewerComponent } from './date-previewer.component';

describe('DatePreviewerComponent', () => {
  let component: DatePreviewerComponent;
  let fixture: ComponentFixture<DatePreviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatePreviewerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
