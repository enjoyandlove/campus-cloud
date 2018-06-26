import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { CPRangePickerComponent } from '../';
import { CPSession } from './../../../session';
import { CPDate } from './../../utils/date/date';
import { CPDatePipe } from './../../pipes/date/date.pipe';
class MockCPSession extends CPSession {
  get tz() {
    return 'America/Toronto';
  }
}

const mockSession = new MockCPSession();

const pickerOptions = {
  utc: true,
  inline: true,
  mode: 'range',
  altInput: true,
  maxDate: CPDate.now('America/Toronto')
    .subtract(1, 'days')
    .startOf('day')
    .format(),
  enableTime: false,
  altFormat: 'F j, Y'
};

declare var $: any;
import 'flatpickr';

describe('CPRangePickerComponent', () => {
  let comp: CPRangePickerComponent;
  let fixture: ComponentFixture<CPRangePickerComponent>;

  const expected = {
    start: 1512363600,
    end: 1512622799,
    label: 'Dec 4th, 2017 - Dec 6th, 2017'
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CPRangePickerComponent],
        providers: [
          { provide: CPSession, useClass: MockCPSession }
          ]
      });
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CPRangePickerComponent);
    comp = fixture.componentInstance;

    comp.picker = $(comp.calendarEl.nativeElement).flatpickr(pickerOptions);
    comp.datePipe = new CPDatePipe(mockSession);
    comp.session = TestBed.get(CPSession);
    comp.props = {
      class: 'secondary',
      isDropdown: true
    };

    spyOn(comp.dateChange, 'emit');
    spyOn(comp.picker, 'clear');
    spyOn(comp.session, 'tz').and.returnValue('America/Toronto');
  });

  it('setLabel', () => {

    expect(comp.selected).toBeNull();

    comp.setLabel(expected);

    fixture.detectChanges();

    expect(comp.selected).toEqual(expected);
  });

  it('triggerChange', () => {

    comp.setLabel(expected);

    comp.triggerChange();

    expect(comp.dateChange.emit).toHaveBeenCalledWith(expected);
  });

  it('resetCalendar', () => {
    comp.resetCalendar();

    expect(comp.picker.clear).toHaveBeenCalled();
  });

  it('onDateChanged', () => {
    const moment = require('moment');
    const date1 = moment('2017-12-04');
    const date2 = moment('2017-12-06');

    spyOn(comp, 'setLabel');
    spyOn(comp, 'triggerChange');

    comp.onDateChanged([date1, date2]);

    expect(comp.setLabel).toHaveBeenCalledWith(expected);

    expect(comp.triggerChange).toHaveBeenCalled();
  });
});
