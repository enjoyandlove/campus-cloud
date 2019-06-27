import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CPLocationsService } from '@campus-cloud/shared/services';

@Injectable()
export class LatLngValidators {
  constructor(public locationService: CPLocationsService) {}

  validateLatitude(lng: AbstractControl): AsyncValidatorFn {
    return (
      lat: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (this.validateCords(lat.value)) {
        return of({ invalidCords: true });
      }

      return this.getCords(lat, lng);
    };
  }

  validateLongitude(lat: AbstractControl): AsyncValidatorFn {
    return (
      lng: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (this.validateCords(lng.value)) {
        return of({ invalidCords: true });
      }

      return this.getCords(lat, lng);
    };
  }

  validateCords(value) {
    if (typeof value !== 'number') {
      if (!value.trim()) {
        return true;
      }
    }
  }

  async getCords(lat, lng) {
    let required = null;

    const location = {
      lat: Number(lat.value),
      lng: Number(lng.value)
    };

    await this.locationService.geoCode(location).catch(() => (required = { invalidCords: true }));

    return required;
  }
}
