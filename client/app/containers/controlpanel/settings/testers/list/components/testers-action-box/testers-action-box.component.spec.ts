import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestersActionBoxComponent } from './testers-action-box.component';

describe('TestersActionBoxComponent', () => {
  let component: TestersActionBoxComponent;
  let fixture: ComponentFixture<TestersActionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestersActionBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestersActionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
