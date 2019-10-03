import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { BehaviorSubject, fromEvent, Observable, of } from 'rxjs';
import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService, CPLocationsService } from '@campus-cloud/shared/services';

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
  @ViewChild('hostEl', { static: true }) hostEl: ElementRef;

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

  @HostListener('document:click')
  onClick() {
    if (this.state.suggestions.length) {
      this.hideSuggestions();
    }
  }

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

            return of(null);
          }

          this.setInput(query);

          return this.service.getAllSuggestions(query, lat, lng);
        }),
        catchError(() => of(null))
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
        const somethingWentWrong = !Object.keys(details).length;

        if (somethingWentWrong) {
          this.placeChange.emit(null);
          this.state = Object.assign({}, this.state, { input: '' });

          return;
        }

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

  hideSuggestions() {
    this.resetSuggestions();

    this.setInput(this.defaultValue);
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
