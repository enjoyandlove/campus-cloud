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

  it(
    'form group should be invalid if geocode fails',
    fakeAsync(() => {
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
    })
  );

  it(
    'form group should be valid if geocode succeeds',
    fakeAsync(() => {
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
    })
  );

  // xit('form group should be invalid given a invalid lat/lng', () => {
  //   const lat = form.get('latitude');
  //   const lng = form.get('longitude');

  //   lat.setAsyncValidators(service.validateLatitude(lng));
  //   lng.setAsyncValidators(service.validateLatitude(lng));

  //   lat.setValue(invalid.latitude);
  //   lng.setValue(invalid.longitude);

  //   expect(form.valid).toBe(false);
  // });
});

// describe('LatLngValidators', () => {
//   const fb = new FormBuilder();
//   const latLngValidator = new LatLngValidators(null);
//   let formGroup: FormGroup;

//   beforeEach(() => {
//     formGroup = fb.group({
//       latitude: [45.5149733],
//       longitude: [-73.5746646]
//     });
//   });

//   afterAll(() => {
//     formGroup.reset({
//       latitude: 45.5149733,
//       longitude: -73.5746646
//     });
//   });

//   let spy;
//   const required = { invalidCords: true };

//   it('should check validation - fail (invalid cords)', () => {
//     spy = spyOn(latLngValidator, 'getCords').and.returnValue(of(required));

//     const invalidCords = 88888888;
//     const lat = formGroup.get('latitude');
//     const lng = formGroup.get('longitude');

//     lat.setValue(invalidCords);
//     lat.setAsyncValidators([latLngValidator.validateLatitude(lng)]);
//     lat.updateValueAndValidity({ onlySelf: true, emitEvent: true });

//     expect(spy).toHaveBeenCalled();
//     expect(formGroup.valid).toBe(false);
//   });

//   it('should check validation - pass (valid cords)', () => {
//     spy = spyOn(latLngValidator, 'getCords').and.returnValue(of(null));
//     const lat = formGroup.get('latitude');
//     const lng = formGroup.get('longitude');

//     lng.setAsyncValidators([latLngValidator.validateLongitude(lat)]);
//     lng.updateValueAndValidity({ onlySelf: true, emitEvent: true });

//     expect(spy).toHaveBeenCalled();
//     expect(formGroup.valid).toBe(true);
//   });
// });
