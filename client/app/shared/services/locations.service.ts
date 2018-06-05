import { from as fromPromise, Subject } from 'rxjs';
import { combineLatest, map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CPSession } from '../../session';
import { LocationsService } from '../../containers/controlpanel/manage/locations/locations.service';

const defaultOptions: google.maps.places.AutocompletionRequest = {
  offset: 5,
  input: null,
  radius: 500
};

@Injectable()
export class CPLocationsService {
  constructor(public locationsService: LocationsService, public session: CPSession) {}

  getLocations(input: string) {
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('search_str', input);

    const results: Array<any> = [
      {
        label: 'Your Locations',
        heading: true,
        value: null,
        isGoogle: false
      }
    ];

    return this.locationsService.getLocations(1, 1000, search).pipe(
      map((locations: Array<any>) => {
        return results.concat(
          locations.map((location) => {
            return {
              label_dark: location.name,
              label_medium: location.address,
              full_label: location.address,
              heading: false,
              value: location,
              isGoogle: false
            };
          })
        );
      })
    );
  }

  geoCode(location): Promise<any> {
    return new Promise((resolve, reject) => {
      const service = new google.maps.Geocoder();

      service.geocode({ location }, (data, status) => {
        status === google.maps.GeocoderStatus.OK ? resolve(data[0]) : reject(status);
      });
    });
  }

  getAddressDetails(address): Promise<any> {
    return new Promise((resolve, reject) => {
      const service = new google.maps.Geocoder();

      service.geocode({ address: address }, (data, status) => {
        status === google.maps.GeocoderStatus.OK ? resolve(data[0]) : reject(status);
      });
    });
  }

  getGoogleSuggestions(input: string, lat: number, lng: number) {
    const location = new google.maps.LatLng(lat, lng);
    const service = new google.maps.places.AutocompleteService();

    const options: google.maps.places.AutocompletionRequest = Object.assign({}, defaultOptions, {
      input,
      location
    });

    const results: Array<any> = [
      {
        label: 'Google Maps Results',
        heading: true,
        value: null,
        isGoogle: false
      }
    ];

    const promise = new Promise((resolve) => {
      service.getPlacePredictions(options, (suggestions, status) => {
        if (!(status === google.maps.places.PlacesServiceStatus.OK)) {
          return resolve([]);
        }

        suggestions.map((suggestion: any) => {
          const mainText = `${suggestion.structured_formatting.main_text}`;
          const secondaryText = `${suggestion.structured_formatting.secondary_text}`;

          results.push({
            label_dark: `${mainText}`,
            label_medium: `${secondaryText}`,
            full_label: `${mainText}, ${secondaryText}`,
            heading: false,
            value: suggestion.place_id,
            isGoogle: true
          });
        });
        resolve(results);
      });
    });

    return fromPromise(promise);
  }

  getAllSuggestions(input: string, lat: number, lng: number) {
    const google$ = this.getGoogleSuggestions(input, lat, lng);
    const locations$ = this.getLocations(input);

    return combineLatest(locations$, google$);
  }

  getLocationDetails(placeId: string, el: HTMLDivElement) {
    const res = new Subject<{}>();
    const service = new google.maps.places.PlacesService(el);

    service.getDetails({ placeId }, (details, status) => {
      return status === google.maps.places.PlacesServiceStatus.OK
        ? res.next(details)
        : res.next({});
    });

    return res.asObservable();
  }
}
