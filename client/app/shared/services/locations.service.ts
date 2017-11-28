import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

const defaultOptions: google.maps.places.AutocompletionRequest = {
  offset: 5,
  input: null,
  radius: 500
}

@Injectable()
export class CPLocationsService {
  constructor() { }

  getLocations() {
    return Observable.of([]);
  }

  geoCode(location) {
    return new Promise((resolve, reject) => {
      const service = new google.maps.Geocoder();

      service.geocode({ location }, (data, status) => {
        status === google.maps.GeocoderStatus.OK ? resolve(data[0]) : reject(status);
      })
    })
  }

  getGoogleSuggestions(input: string, lat: number, lng: number) {
    const location = new google.maps.LatLng(lat, lng);
    const service = new google.maps.places.AutocompleteService();

    const options: google.maps.places.AutocompletionRequest = Object.assign(
      {},
      defaultOptions,
      { input, location }
    );

    let results: Array<any> = [
      {
        'label': 'Google Maps Results',
        'heading': true,
        'value': null,
        'isGoogle': false
      }
    ];

    const promise = new Promise(resolve => {
      service.getPlacePredictions(options, (suggestions, status) => {
        if (!(status === google.maps.places.PlacesServiceStatus.OK)) {
          return resolve([]);
        }

        suggestions.map((suggestion: any) => {
          const mainText = `${suggestion.structured_formatting.main_text}`;
          const secondaryText = `${suggestion.structured_formatting.secondary_text}`;

          results.push(
            {
              'label_dark': `${mainText}`,
              'label_medium': `${secondaryText}`,
              'full_label': `${mainText}, ${secondaryText}`,
              'heading': false,
              'value': suggestion.place_id,
              'isGoogle': true
            }
          )
        })
        resolve(results);
      })
    })

    return Observable.fromPromise(promise);
  }

  getAllSuggestions(input: string, lat: number, lng: number) {
    const google$ = this.getGoogleSuggestions(input, lat, lng);
    const locations$ = this.getLocations();

    return Observable.combineLatest(locations$, google$);
  }

  getLocationDetails(placeId: string, el: HTMLDivElement) {
    const res = new Subject<{}>();
    const service = new google.maps.places.PlacesService(el);

    service.getDetails({ placeId }, (details, status) => {
      return status === google.maps.places.PlacesServiceStatus.OK ?
        res.next(details) : res.next({});
    })

    return res.asObservable();
  }
}
