import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPTableComponent } from './cp-table.component';

describe('CPTableComponent', () => {
  let component: CPTableComponent;
  let fixture: ComponentFixture<CPTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CPTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CPTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
