import {
  Input,
  NgZone,
  OnInit,
  Output,
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  AfterViewInit
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

declare var google: any;

@Component({
  selector: 'cp-place-autocomplete',
  templateUrl: './cp-place-autocomplete.component.html',
  styleUrls: ['./cp-place-autocomplete.component.scss']
})
export class CPPlaceAutoCompleteComponent implements OnInit, AfterViewInit {
  @Input() placeHolder: string;
  @Input() defaultValue: string;
  @Output() placeChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('input') input: ElementRef;

  constructor(
    private zone: NgZone,
  ) { }

  ngAfterViewInit() {
    const input = this.input.nativeElement;

    const stream$ = Observable.fromEvent(input, 'keyup');

    stream$.subscribe((res: any) => {
      let query = res.target.value;

      if (!query) {
        this.placeChange.emit(null);
      }
    });

    const options = {
      'types': ['establishment']
    };

    const autocomplete = new google.maps.places.Autocomplete(input, options);


    input.value = this.defaultValue ? this.defaultValue : null;

    autocomplete.addListener('place_changed', () => {
      this.zone.run(() => {
        this.placeChange.emit(autocomplete.getPlace());
      });
    });
  }

  ngOnInit() { }
}
