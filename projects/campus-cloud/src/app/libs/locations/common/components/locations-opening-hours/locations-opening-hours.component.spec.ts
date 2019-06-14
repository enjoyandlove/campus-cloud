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
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';
import { LocationsOpeningHoursComponent } from './locations-opening-hours.component';
import {
  LocationsDayLabelPipe,
  LocationsTimeLabelPipe
} from '@campus-cloud/libs/locations/common/pipes';

describe('LocationsOpeningHoursComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule],
        providers: [CPSession],
        declarations: [LocationsOpeningHoursComponent, LocationsDayLabelPipe],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let de: DebugElement;
  let fixture: ComponentFixture<LocationsOpeningHoursComponent>;
  let component: LocationsOpeningHoursComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsOpeningHoursComponent);
    component = fixture.componentInstance;

    const cpI18n = new CPI18nService();
    const timeLabelPipe = new LocationsTimeLabelPipe();
    const parseSchedule = new LocationsUtilsService(cpI18n, timeLabelPipe);
    component.openingHours = parseSchedule.parsedSchedule(mockSchedule);

    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should have schedule/opening-hours times', () => {
    const closed = 'Closed';
    const timing = '1:00 AM - 5:00 AM';

    const monday = getElementByCPTargetValue(de, 'closed_0').nativeElement;
    const tuesday = getElementByCPTargetValue(de, 'time_1').nativeElement;
    const wednesday = getElementByCPTargetValue(de, 'closed_2').nativeElement;
    const thursday = getElementByCPTargetValue(de, 'closed_3').nativeElement;
    const friday = getElementByCPTargetValue(de, 'closed_4').nativeElement;
    const saturday = getElementByCPTargetValue(de, 'closed_5').nativeElement;
    const sunday = getElementByCPTargetValue(de, 'closed_6').nativeElement;

    expect(monday.textContent).toEqual(closed);
    expect(tuesday.textContent).toEqual(timing);
    expect(wednesday.textContent).toEqual(closed);
    expect(thursday.textContent).toEqual(closed);
    expect(friday.textContent).toEqual(closed);
    expect(saturday.textContent).toEqual(closed);
    expect(sunday.textContent).toEqual(closed);
  });
});
