import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPTableCloseComponent } from './cp-table-close.component';

describe('CPTableCloseComponent', () => {
  let component: CPTableCloseComponent;
  let fixture: ComponentFixture<CPTableCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CPTableCloseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CPTableCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
