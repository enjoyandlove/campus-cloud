import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { emptyCalendarFormGroup } from '../../tests/mocks';
import { CalendarsFormComponent } from './calendar-form.component';
import { CPSwitchComponent } from '@campus-cloud/shared/components';
import { ProgramMembership } from './../../../orientation/orientation.status';

describe('CalendarsFormComponent', () => {
  let de: DebugElement;
  let component: CalendarsFormComponent;
  let fixture: ComponentFixture<CalendarsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarsFormComponent],
      imports: [CPTestModule, ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarsFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.form = emptyCalendarFormGroup;
    fixture.detectChanges();
  });

  it('should set isChecked based on the forms has_membership control, when isOrientation is true', () => {
    const expected = true;
    component.isOrientation = true;
    component.form.get('has_membership').setValue(expected);

    fixture.detectChanges();

    expect(component.isChecked).toBe(expected);
  });

  describe('toggleMembership', () => {
    let cpSwitch: CPSwitchComponent;
    beforeEach(() => {
      component.isOrientation = true;
      spyOn(component, 'toggleMembership').and.callThrough();
      component.form.get('has_membership').setValue(ProgramMembership.disabled);
      fixture.detectChanges();

      cpSwitch = de.query(By.directive(CPSwitchComponent)).componentInstance;
    });

    it('should trigger on cp-switch toggle event', () => {
      cpSwitch.toggle.emit(true);
      expect(component.toggleMembership).toHaveBeenCalledWith(true);
    });

    it('should update form has_membership control', () => {
      cpSwitch.toggle.emit(true);
      expect(component.form.get('has_membership').value).toBe(ProgramMembership.enabled);

      cpSwitch.toggle.emit(false);
      expect(component.form.get('has_membership').value).toBe(ProgramMembership.disabled);
    });
  });
});
