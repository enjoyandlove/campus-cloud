import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { DashboardDatePickerComponent } from '../index';
import { DashboardUtilsService } from '../../dashboard.utils.service';

let pickerOptions = {
  utc: true,
  inline: true,
  mode: 'range',
  altInput: true,
  maxDate: new Date(Date.now() - 24 * 3600 * 1000),
  enableTime: false,
  altFormat: 'F j, Y'
}

declare var $: any;
import 'flatpickr';

describe('DashboardDatePickerComponent', () => {
  let helper: DashboardUtilsService;
  let comp: DashboardDatePickerComponent;
  let fixture: ComponentFixture<DashboardDatePickerComponent>;

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDatePickerComponent ],
      providers: [ DashboardUtilsService ]
    })
    // .compileComponents(); // compile template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDatePickerComponent);
    comp = fixture.componentInstance;

    comp.picker = $(comp.calendarEl.nativeElement).flatpickr(pickerOptions)

    helper = TestBed.get(DashboardUtilsService);
  });

  it('setLabel', () => {
    const expected = helper.last30Days();

    expect(comp.selected).toBeNull();

    comp.setLabel(expected);

    fixture.detectChanges();

    expect(comp.selected).toEqual(expected);
  })

  xit('triggerChange', () => {
    const expected = helper.last30Days();

    comp.setLabel(expected);

    comp.dateChange.emit()
  })
})
