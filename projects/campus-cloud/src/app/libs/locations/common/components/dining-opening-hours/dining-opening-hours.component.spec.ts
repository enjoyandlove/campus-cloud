import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { mockSchedule } from '@campus-cloud/libs/locations/common/tests';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { DiningOpeningHoursComponent } from './dining-opening-hours.component';
import { LocationsDayLabelPipe } from '@campus-cloud/libs/locations/common/pipes';
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';

describe('DiningOpeningHoursComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule],
        providers: [CPSession],
        declarations: [DiningOpeningHoursComponent, LocationsDayLabelPipe],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let de: DebugElement;
  let fixture: ComponentFixture<DiningOpeningHoursComponent>;
  let component: DiningOpeningHoursComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningOpeningHoursComponent);
    component = fixture.componentInstance;

    const cpI18n = new CPI18nService();
    const parseSchedule = new LocationsUtilsService(cpI18n);
    component.openingHours = parseSchedule.parsedSchedule(mockSchedule);
    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should have schedule/opening-hours times', () => {
    const closed = 'Closed';
    const name = 'hello world';
    const timing = '1:00 AM - 5:00 AM';

    const monday = getElementByCPTargetValue(de, 'closed_0').nativeElement;
    const wednesday = getElementByCPTargetValue(de, 'closed_2').nativeElement;
    const thursday = getElementByCPTargetValue(de, 'closed_3').nativeElement;
    const friday = getElementByCPTargetValue(de, 'closed_4').nativeElement;
    const saturday = getElementByCPTargetValue(de, 'closed_5').nativeElement;
    const sunday = getElementByCPTargetValue(de, 'closed_6').nativeElement;

    const tuesdayItem = getElementByCPTargetValue(de, 'item_0');

    const tuesdayItemName = getElementByCPTargetValue(tuesdayItem, 'name').nativeElement;
    const tuesdayItemTime = getElementByCPTargetValue(tuesdayItem, 'time').nativeElement;

    expect(monday.textContent.trim()).toEqual(closed);
    expect(wednesday.textContent.trim()).toEqual(closed);
    expect(thursday.textContent.trim()).toEqual(closed);
    expect(friday.textContent.trim()).toEqual(closed);
    expect(saturday.textContent.trim()).toEqual(closed);
    expect(sunday.textContent.trim()).toEqual(closed);

    expect(tuesdayItemName.textContent).toEqual(name);
    expect(tuesdayItemTime.textContent).toEqual(timing);
  });
});
