import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

const defaultOptions: google.maps.places.AutocompletionRequest = {
  offset: 3,
  input: null,
  radius: 500
}

@Injectable()
export class CPLocationsService {
  // placesServices: google.maps.places.PlacesService;
  defaultOptions: google.maps.places.AutocompletionRequest;
  autoCompleteService = new google.maps.places.AutocompleteService();

  constructor() { }

  getLocations() {
    return Observable.empty();
  }

  getGoogleSuggestions(input: string) {
    const service = new google.maps.places.AutocompleteService();

    const options: google.maps.places.AutocompletionRequest = Object.assign(
      {},
      defaultOptions,
      { input }
    );

    let results: Array<any> = [
      {
        'label': 'Google Maps Results',
        'heading': true,
        'value': null,
        'isGoogle': false
      }
    ]

    service.getPlacePredictions(options, (suggestions, status) => {
      if (!(status === google.maps.places.PlacesServiceStatus.OK)) {
        return [];
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
      return results;
    })
    return Observable.of(results);
  }

  getAllSuggestions(input: string) {
    const google$ = this.getGoogleSuggestions(input);
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
