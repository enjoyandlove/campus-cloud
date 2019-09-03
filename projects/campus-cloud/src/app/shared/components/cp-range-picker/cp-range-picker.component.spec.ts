import { CPTestModule } from '@projects/campus-cloud/src/app/shared/tests';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { CPI18nPipe } from '../../pipes';
import { CPRangePickerComponent } from '../';
import { CPSession } from './../../../session';
import { CPDatePipe } from './../../pipes/date/date.pipe';
import { CPRangePickerUtilsService } from './cp-range-picker.utils.service';

class MockCPSession extends CPSession {
  get tz() {
    return 'America/Toronto';
  }
}

describe('CPRangePickerComponent', () => {
  let session: CPSession;
  let comp: CPRangePickerComponent;
  let fixture: ComponentFixture<CPRangePickerComponent>;

  const expected = {
    start: 1512363600,
    end: 1512622799,
    label: 'Dec 4, 2017 - Dec 6, 2017'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      providers: [
        CPRangePickerUtilsService,
        CPDatePipe,
        { provide: CPSession, useClass: MockCPSession }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CPRangePickerComponent);
    comp = fixture.componentInstance;

    session = TestBed.get(CPSession);
    comp.label = null;
    comp.class = 'secondary';
    comp.icon = 'keyboard_arrow_down';

    spyOn(comp.rangeChange, 'emit');
    spyOn(session, 'tz').and.returnValue('America/Toronto');
  });

  it('setLabel', () => {
    expect(comp.label).toBeNull();

    comp.setLabel(expected);

    fixture.detectChanges();

    expect(comp.label).toEqual(expected.label);
  });

  it('triggerChange', () => {
    comp.setLabel(expected);

    comp.triggerChange(expected);

    expect(comp.rangeChange.emit).toHaveBeenCalledWith(expected);
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
