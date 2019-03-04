import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestersCreateComponent } from './testers-create.component';

describe('TestersCreateComponent', () => {
  let component: TestersCreateComponent;
  let fixture: ComponentFixture<TestersCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestersCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
