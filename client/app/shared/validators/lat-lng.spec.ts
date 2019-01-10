import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LatLngValidators } from '@shared/validators/lat-lng';

describe('LatLngValidators', () => {
  const fb = new FormBuilder();
  const latLngValidator = new LatLngValidators(null);

  const formGroup = fb.group({
    latitude: [45.5149733],
    longitude: [-73.5746646],
  });

  let spy;
  const required = { invalidCords: true };

  it('should check validation - fail (invalid cords)', () => {
    spy = spyOn(latLngValidator, 'getCords').and.returnValue(of(required));

    const invalidCords = 88888888;
    const lat = formGroup.get('latitude');
    const lng = formGroup.get('longitude');

    lat.setValue(invalidCords);
    lat.setAsyncValidators([latLngValidator.validateLatitude(lng)]);
    lat.updateValueAndValidity({ onlySelf: true, emitEvent: true });

    expect(spy).toHaveBeenCalled();
    expect(formGroup.valid).toBe(false);
  });

  it('should check validation - pass (valid cords)', () => {
    spy = spyOn(latLngValidator, 'getCords').and.returnValue(of(null));
    const validCords = 45.5149733;
    const lat = formGroup.get('latitude');
    const lng = formGroup.get('longitude');

    lng.setValue(validCords);
    lng.setAsyncValidators([latLngValidator.validateLongitude(lat)]);
    lng.updateValueAndValidity({ onlySelf: true, emitEvent: true });

    expect(spy).toHaveBeenCalled();
    expect(formGroup.valid).toBe(true);
  });
});
