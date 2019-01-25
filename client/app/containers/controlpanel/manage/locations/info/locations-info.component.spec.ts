import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { configureTestSuite } from '@app/shared/tests';
import { getElementByCPTargetValue } from '@shared/utils/tests';
import { LocationsInfoComponent } from './locations-info.component';
import { LocationsUtilsService } from '@libs/locations/common/utils';
import { mockLocations, mockSchedule, mockLinks } from '@libs/locations/common/tests';
import { LocationsTimeLabelPipe, LocationsDayLabelPipe} from '@libs/locations/common/pipes';

describe('LocationsInfoComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [LocationsUtilsService, LocationsTimeLabelPipe, CPI18nService, CPSession],
        declarations: [LocationsInfoComponent, LocationsDayLabelPipe],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let de: DebugElement;
  let fixture: ComponentFixture<LocationsInfoComponent>;
  let component: LocationsInfoComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsInfoComponent);
    component = fixture.componentInstance;

    const locations = {
      ...mockLocations[0],
      links: mockLinks,
      schedule: mockSchedule
    };

    spyOn(component.store, 'select').and.returnValue(of(locations));

    fixture.detectChanges();
    component.loading$ = of(false);

    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should have phone number', () => {
    const phone = getElementByCPTargetValue(de, 'phone').nativeElement;

    expect(phone.textContent).toEqual(component.location.phone.toString());
  });

  it('should have email', () => {
    const email = getElementByCPTargetValue(de, 'email').nativeElement;

    expect(email.textContent).toEqual(component.location.email);
  });

  it('should have address', () => {
    const address = getElementByCPTargetValue(de, 'address').nativeElement;

    expect(address.textContent).toEqual(component.location.address);
  });

  it('should have acronym', () => {
    const acronym = getElementByCPTargetValue(de, 'acronym').nativeElement;

    expect(acronym.textContent).toEqual(component.location.short_name);
  });

  it('should have description', () => {
    const description = getElementByCPTargetValue(de, 'description').nativeElement;

    expect(description.textContent.trim()).toEqual(component.location.description);
  });

  it('should have link label', () => {
    const label = getElementByCPTargetValue(de, 'label').nativeElement;

    expect(label.textContent.trim()).toEqual(component.location.links[0].label);
  });

  it('should have link url', () => {
    const url = getElementByCPTargetValue(de, 'url').nativeElement;

    expect(url.textContent.trim()).toEqual(component.location.links[0].url);
  });

  it('should have schedule/opening-hours times', () => {
    const closed = 'Closed';
    const timing = '1:00 AM - 5:00 AM';

    const monday = getElementByCPTargetValue(de, 'time_0').nativeElement;
    const tuesday = getElementByCPTargetValue(de, 'time_1').nativeElement;
    const wednesday = getElementByCPTargetValue(de, 'time_2').nativeElement;
    const thursday = getElementByCPTargetValue(de, 'time_3').nativeElement;
    const friday = getElementByCPTargetValue(de, 'time_4').nativeElement;
    const saturday = getElementByCPTargetValue(de, 'time_5').nativeElement;
    const sunday = getElementByCPTargetValue(de, 'time_6').nativeElement;

    expect(monday.textContent).toEqual(closed);
    expect(tuesday.textContent).toEqual(timing);
    expect(wednesday.textContent).toEqual(closed);
    expect(thursday.textContent).toEqual(closed);
    expect(friday.textContent).toEqual(closed);
    expect(saturday.textContent).toEqual(closed);
    expect(sunday.textContent).toEqual(closed);
  });
});
