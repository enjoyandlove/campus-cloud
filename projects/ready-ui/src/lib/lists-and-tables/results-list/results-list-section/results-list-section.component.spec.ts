import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsListSectionComponent } from './results-list-section.component';

describe('ResultsListSectionComponent', () => {
  let component: ResultsListSectionComponent;
  let fixture: ComponentFixture<ResultsListSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsListSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
