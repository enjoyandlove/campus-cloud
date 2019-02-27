import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestUsersComponent } from './test-users.component';

describe('TestUsersComponent', () => {
  let component: TestUsersComponent;
  let fixture: ComponentFixture<TestUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
