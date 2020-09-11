import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSelfCheckInComponent } from './base-self-check-in.component';

describe('BaseSelfCheckInComponent', () => {
  let component: BaseSelfCheckInComponent;
  let fixture: ComponentFixture<BaseSelfCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseSelfCheckInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseSelfCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
