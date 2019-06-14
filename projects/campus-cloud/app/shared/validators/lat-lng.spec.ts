import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CPSession } from '@app/session';
import { CPLocationsService } from '@shared/services';
import { LatLngValidators } from '@shared/validators/lat-lng';
import { LocationsService } from '@containers/controlpanel/manage/locations/locations.service';

const fb = new FormBuilder();
class MockLocationsService {}

const cords = {
  latitude: 45.5149733,
  longitude: -73.5746646
};

describe('LatLngValidators', () => {
  let form: FormGroup;
  let service: LatLngValidators;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CPSession,
        LatLngValidators,
        CPLocationsService,
        { provide: LocationsService, useClass: MockLocationsService }
      ]
    });

    form = fb.group({
      latitude: null,
      longitude: null
    });

    service = TestBed.get(LatLngValidators);
  });

  it('form should be invalid if geocode fails', fakeAsync(() => {
    spyOn(service.locationService, 'geoCode').and.returnValue(Promise.reject('invalid'));
    const lat = form.get('latitude');
    const lng = form.get('longitude');

    lat.setAsyncValidators(service.validateLatitude(lng));
    lng.setAsyncValidators(service.validateLongitude(lat));

    lat.setValue(cords.latitude);
    lng.setValue(cords.longitude);

    lat.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    lng.updateValueAndValidity({ onlySelf: true, emitEvent: true });

    tick();

    expect(form.valid).toBe(false);
  }));

  it('form should be valid if geocode succeeds', fakeAsync(() => {
    spyOn(service.locationService, 'geoCode').and.returnValue(Promise.resolve(null));
    const lat = form.get('latitude');
    const lng = form.get('longitude');

    lat.setAsyncValidators(service.validateLatitude(lng));
    lng.setAsyncValidators(service.validateLongitude(lat));

    lat.setValue(cords.latitude);
    lng.setValue(cords.longitude);

    lat.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    lng.updateValueAndValidity({ onlySelf: true, emitEvent: true });

    tick();

    expect(form.valid).toBe(true);
  }));
});
