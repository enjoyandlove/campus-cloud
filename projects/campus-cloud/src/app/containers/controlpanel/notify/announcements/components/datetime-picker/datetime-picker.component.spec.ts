import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils/date';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { AnnouncementsDatetimePickerComponent } from './datetime-picker.component';

describe('AnnouncementsDatetimePickerComponent', () => {
  let de: DebugElement;
  let session: CPSession;
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
    session = TestBed.get(CPSession);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('onDateChange', () => {
    it('should set selectedDate to a moment object', () => {
      const date = '2019-11-05';
      component.onDateChange(date);
      const exepected = CPDate.toEpoch(date, session.tz) * 1000;
      expect(component.selectedDate).toBe(exepected);
    });
  });
});
