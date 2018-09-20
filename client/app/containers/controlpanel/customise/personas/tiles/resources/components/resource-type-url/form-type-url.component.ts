import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { CPI18nService } from './../../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-resource-type-url',
  templateUrl: './form-type-url.component.html',
  styleUrls: ['./form-type-url.component.scss']
})
export class PersonasResourceTypeUrlComponent implements OnInit, OnDestroy {
  @Input() value: string;

  @ViewChild('inputEl') inputEl: ElementRef;

  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  isAlive = true;
  invalidInput = false;
  errorMessage: string;

  constructor(public cpI18n: CPI18nService) {}

  listenForInputChanges() {
    const el = this.inputEl.nativeElement;
    const stream$ = fromEvent(el, 'keyup');

    stream$
      .pipe(
        takeWhile(() => this.isAlive),
        map((event: any) => event.target.value),
        map((input: string) => {
          const validUrl = /^((http|https):\/\/)/;
          this.invalidInput = !validUrl.test(input);

          return this.invalidInput ? null : input;
        })
      )
      .subscribe((input) => this.valueChange.emit(input));
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  ngOnInit(): void {
    this.listenForInputChanges();
    this.errorMessage = this.cpI18n.translate('t_shared_invalid_url');
  }
}
