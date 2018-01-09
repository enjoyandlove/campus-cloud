import {
  Input,
  OnInit,
  Output,
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { CPSession } from './../../../session';
import { CPLocationsService } from '../../services/locations.service';

interface IState {
  input: string;
  suggestions: Array<any>;
}

const service = new CPLocationsService();

@Component({
  selector: 'cp-place-autocomplete',
  templateUrl: './cp-place-autocomplete.component.html',
  styleUrls: ['./cp-place-autocomplete.component.scss']
})
export class CPPlaceAutoCompleteComponent implements OnInit, AfterViewInit {
  @ViewChild('hostEl') hostEl: ElementRef;

  @Input() placeHolder: string;
  @Input() defaultValue: string;
  @Input() newAddress: Observable<string>;

  @Output() placeChange: EventEmitter<any> = new EventEmitter();
  @Output() backToDefault: EventEmitter<null> = new EventEmitter();

  state: IState = {
    input: null,
    suggestions: []
  }

  constructor(
    private cpSession: CPSession,
    private ref: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    const input = this.hostEl.nativeElement;
    const stream$ = Observable.fromEvent(input, 'keyup');
    const lat = this.cpSession.g.get('school').latitude;
    const lng = this.cpSession.g.get('school').longitude;

    stream$
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((event: any) => {
        let query = event.target.value;

        if (!query) {
          this.placeChange.emit(null);
          return Observable.empty();
        }

        this.setInput(query);
        return service.getAllSuggestions(query, lat, lng)
      })
      .subscribe(
        res => this.setSuggestions(res),
        err => console.log(err)
      )
  }


  handleClick(location) {
    if (!location.value) { return; }

    this.resetSuggestions();
    this.setInput(location.full_label);

    if (location.isGoogle) {
      this.fetchGoogleDetails(location);
      return;
    }

    const locationData = Object.assign(
      {},
      location.value,
      {
        fromUsersLocations: true
       }
    )

    this.placeChange.emit(locationData);
  }

  reset() {
    this.resetInput();
    this.resetSuggestions();
    this.backToDefault.emit();
    this.placeChange.emit(null);
  }

  fetchGoogleDetails(location) {
    service
      .getLocationDetails(location.value, this.hostEl.nativeElement)
      .subscribe(
      details => {
        details = Object.assign(
          {},
          details,
          { name: location.full_label }
        )
        this.placeChange.emit(details);
      },
      () => this.placeChange.emit(null)
      )
  }

  noResultsIfEmpty(results: Array<any>) {
    return results.length === 1 ?
      [...results, { 'label_medium': 'No Results', 'value': null }] : results
  }

  setInput(input): void {
    this.state = Object.assign({}, this.state, { input });
  }

  resetInput(): void {
    this.state = Object.assign({}, this.state, { input: null });
  }

  setSuggestions(suggestions): void {
    this.state = Object.assign(
      {},
      this.state,
      { suggestions: [...suggestions[1]] });
  }

  resetSuggestions(): void {
    this.state = Object.assign({}, this.state, { suggestions: [] });
  }

  ngOnInit() {
    if (this.defaultValue) {
      this.setInput(this.defaultValue);
    }

    this.newAddress.subscribe(address => {
      if (address) {
        this.setInput(address);
        this.ref.detectChanges();
      }
    })
  }
}
