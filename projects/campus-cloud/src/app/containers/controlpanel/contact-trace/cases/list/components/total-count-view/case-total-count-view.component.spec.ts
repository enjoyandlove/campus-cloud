import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTotalCountViewComponent } from './case-total-count-view-component.component';

describe('CaseTotalCountViewComponent', () => {
  let component: CaseTotalCountViewComponent;
  let fixture: ComponentFixture<CaseTotalCountViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseTotalCountViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseTotalCountViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
