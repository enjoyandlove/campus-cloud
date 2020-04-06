import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpUnsavedChangesModalComponent } from './cp-unsaved-changes-modal.component';

describe('CpUnsavedChangesModalComponent', () => {
  let component: CpUnsavedChangesModalComponent;
  let fixture: ComponentFixture<CpUnsavedChangesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpUnsavedChangesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpUnsavedChangesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
