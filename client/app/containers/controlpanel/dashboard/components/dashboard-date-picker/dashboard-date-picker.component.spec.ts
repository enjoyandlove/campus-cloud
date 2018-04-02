import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { DashboardDatePickerComponent } from '../index';
import { DashboardUtilsService } from '../../dashboard.utils.service';

const pickerOptions = {
  utc: true,
  inline: true,
  mode: 'range',
  altInput: true,
  maxDate: new Date(Date.now() - 24 * 3600 * 1000),
  enableTime: false,
  altFormat: 'F j, Y'
};

declare var $: any;
import 'flatpickr';

describe('DashboardDatePickerComponent', () => {
  let helper: DashboardUtilsService;
  let comp: DashboardDatePickerComponent;
  let fixture: ComponentFixture<DashboardDatePickerComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [DashboardDatePickerComponent],
        providers: [DashboardUtilsService]
      });
      // .compileComponents(); // compile template and css
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDatePickerComponent);
    comp = fixture.componentInstance;

    comp.picker = $(comp.calendarEl.nativeElement).flatpickr(pickerOptions);

    spyOn(comp.dateChange, 'emit');
    spyOn(comp.picker, 'clear');

    helper = TestBed.get(DashboardUtilsService);
  });

  it('setLabel', () => {
    const expected = helper.last30Days();

    expect(comp.selected).toBeNull();

    comp.setLabel(expected);

    fixture.detectChanges();

    expect(comp.selected).toEqual(expected);
  });

  it('triggerChange', () => {
    const expected = helper.last30Days();

    comp.setLabel(expected);

    comp.triggerChange();

    expect(comp.dateChange.emit).toHaveBeenCalledWith(expected);
  });

  it('resetCalendar', () => {
    comp.resetCalendar();

    expect(comp.picker.clear).toHaveBeenCalled();
  });

  it('onDateChanged', () => {
    const date1 = new Date('2017-12-04T05:00:00.000Z');
    const date2 = new Date('2017-12-06T05:00:00.000Z');

    const expected = {
      start: 1512363600,
      end: 1512622799,
      label: 'Dec 4th, 2017 - Dec 6th, 2017'
    };

    spyOn(comp, 'setLabel');
    spyOn(comp, 'triggerChange');

    comp.onDateChanged([date1, date2]);

    expect(comp.setLabel).toHaveBeenCalledWith(expected);

    expect(comp.triggerChange).toHaveBeenCalled();
  });
});
