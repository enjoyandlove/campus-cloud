import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestersListComponent } from './testers-list.component';

describe('TestersListComponent', () => {
  let component: TestersListComponent;
  let fixture: ComponentFixture<TestersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
