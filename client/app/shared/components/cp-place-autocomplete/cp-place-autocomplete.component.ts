import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CPSession } from './../../../session';
import { CPI18nService } from '../../services';
import { CPLocationsService } from '../../services/locations.service';

interface IState {
  input: string;
  suggestions: Array<any>;
}

@Component({
  selector: 'cp-place-autocomplete',
  templateUrl: './cp-place-autocomplete.component.html',
  styleUrls: ['./cp-place-autocomplete.component.scss']
})
export class CPPlaceAutoCompleteComponent implements OnInit, AfterViewInit {
  @ViewChild('hostEl') hostEl: ElementRef;

  @Input() placeHolder: string;
  @Input() defaultValue: string;
  @Input() disableLocations: boolean;
  @Input() newAddress: Observable<string>;

  @Output() placeChange: EventEmitter<any> = new EventEmitter();
  @Output() backToDefault: EventEmitter<null> = new EventEmitter();

  state: IState = {
    input: null,
    suggestions: []
  };

  constructor(
    private cpSession: CPSession,
    public cpI18n: CPI18nService,
    private ref: ChangeDetectorRef,
    public service: CPLocationsService
  ) {}

  ngAfterViewInit() {
    const input = this.hostEl.nativeElement;
    const stream$ = fromEvent(input, 'keyup');
    const lat = this.cpSession.g.get('school').latitude;
    const lng = this.cpSession.g.get('school').longitude;

    stream$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((event: any) => {
          const query = event.target.value;

          if (!query) {
            this.placeChange.emit(null);

            return observableOf(null);
          }

          this.setInput(query);

          return this.service.getAllSuggestions(query, lat, lng);
        })
      )
      .subscribe((res) => this.setSuggestions(res));
  }

  handleClick(location) {
    if (!location.value) {
      return;
    }

    this.resetSuggestions();
    this.setInput(location.full_label);

    if (location.isGoogle) {
      this.fetchGoogleDetails(location);

      return;
    }

    const locationData = Object.assign({}, location.value, {
      fromUsersLocations: true
    });

    this.placeChange.emit(locationData);
  }

  reset() {
    this.resetInput();
    this.resetSuggestions();
    this.backToDefault.emit();
    this.placeChange.emit(null);
  }

  fetchGoogleDetails(location) {
    this.service.getLocationDetails(location.value, this.hostEl.nativeElement).subscribe(
      (details) => {
        details = Object.assign({}, details, { name: location.full_label });
        this.placeChange.emit(details);
      },
      () => this.placeChange.emit(null)
    );
  }

  noResultsIfEmpty(results: Array<any>) {
    return results.length === 1
      ? [...results, { label_medium: 'No Results', value: null }]
      : results;
  }

  setInput(input): void {
    this.state = Object.assign({}, this.state, { input });
  }

  resetInput(): void {
    this.state = Object.assign({}, this.state, { input: null });
  }

  setSuggestions(suggestions): void {
    if (!suggestions) {
      this.state = Object.assign({}, this.state, { suggestions: [] });

      return;
    }

    const showAll = this.disableLocations === undefined;
    const newSuggestions = showAll
      ? [...this.noResultsIfEmpty(suggestions[0]), ...this.noResultsIfEmpty(suggestions[1])]
      : [...this.noResultsIfEmpty(suggestions[1])];

    this.state = Object.assign({}, this.state, { suggestions: newSuggestions });
  }

  resetSuggestions(): void {
    this.state = Object.assign({}, this.state, { suggestions: [] });
  }

  ngOnInit() {
    if (this.defaultValue) {
      this.setInput(this.defaultValue);
    }

    if (this.newAddress === undefined) {
      this.newAddress = new BehaviorSubject(null);
    }

    this.newAddress.subscribe((address) => {
      if (address) {
        this.setInput(address);
        this.ref.detectChanges();
      }
    });
  }
}
