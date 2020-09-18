import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinMethodeListComponent } from './checkin-methode-list.component';
import { CPI18nPipeMock } from '@controlpanel/contact-trace/forms/components/form-duplicate/form-duplicate.component.spec';

describe('CheckinMethodeListComponent', () => {
  let component: CheckinMethodeListComponent;
  let fixture: ComponentFixture<CheckinMethodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckinMethodeListComponent, CPI18nPipeMock]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinMethodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
