import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestersDeleteComponent } from './testers-delete.component';

describe('TestersDeleteComponent', () => {
  let component: TestersDeleteComponent;
  let fixture: ComponentFixture<TestersDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestersDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestersDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
