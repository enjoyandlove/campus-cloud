import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfCheckInComponent } from './self-check-in.component';

describe('SelfCheckInComponent', () => {
  let component: SelfCheckInComponent;
  let fixture: ComponentFixture<SelfCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfCheckInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
