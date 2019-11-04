import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import * as moment from 'moment';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { AnnouncementsDatetimePickerComponent } from './datetime-picker.component';

describe('AnnouncementsDatetimePickerComponent', () => {
  let de: DebugElement;
  let component: AnnouncementsDatetimePickerComponent;
  let fixture: ComponentFixture<AnnouncementsDatetimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      declarations: [AnnouncementsDatetimePickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementsDatetimePickerComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('onSetTime', () => {
    it('should call setTimeToDate', () => {
      spyOn(component, 'setTimeToDate');
      component.onSetTime();
      expect(component.setTimeToDate).toHaveBeenCalled();
    });

    it('should call disposeDropdown', () => {
      spyOn(component, 'disposeDropdown');
      component.onSetTime();
      expect(component.disposeDropdown).toHaveBeenCalled();
    });

    it('should emit dateSet with right value', () => {
      spyOn(component.dateSet, 'emit');
      component.onSetTime();
      expect(component.dateSet.emit).toHaveBeenCalledWith(component.selectedDate.unix());
    });

    it('should be called on set time button click event', () => {
      spyOn(component, 'onSetTime');
      const button: HTMLButtonElement = getElementByCPTargetValue(de, 'set-time-btn').nativeElement;
      button.click();
      expect(component.onSetTime).toHaveBeenCalled();
    });
  });

  describe('clearDate', () => {
    it('should emit dataSet with null', () => {
      spyOn(component.dateSet, 'emit');
      component.clearDate();
      expect(component.dateSet.emit).toHaveBeenCalledWith(null);
    });
  });

  describe('onTimeChange', () => {
    it('should set selectedTime to arugment value', () => {
      const expected = '10:45';
      component.onTimeChange(expected);
      expect(component.selectedTime).toBe(expected);
    });
  });

  describe('onDateChange', () => {
    it('should set selectedDate to a moment object', () => {
      const date = '2019-11-05';
      component.onDateChange(date);
      expect(component.selectedDate.toString()).toBe(moment(date).toString());
    });
  });

  describe('setTimeToDate', () => {
    it('should update selectedDate with current selectedTime values', () => {
      component.selectedTime = '3:45';
      fixture.detectChanges();
      component.setTimeToDate();

      const resultedHours = component.selectedDate.get('hours');
      const resultedMinutes = component.selectedDate.get('minutes');

      expect(resultedHours).toBe(3);
      expect(resultedMinutes).toBe(45);
    });
  });
});
