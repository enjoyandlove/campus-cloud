import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPTableRichCellComponent } from './cp-table-rich-cell.component';

describe('CPTableRichCellComponent', () => {
  let component: CPTableRichCellComponent;
  let fixture: ComponentFixture<CPTableRichCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CPTableRichCellComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CPTableRichCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
