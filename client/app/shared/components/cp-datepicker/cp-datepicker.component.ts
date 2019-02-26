import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';

import { CPDate } from '../../utils';
import { CPI18nService } from '../../services';
import * as French from 'flatpickr/dist/l10n/fr.js';
/**
 * https://chmln.github.io/flatpickr/
 */

declare var $: any;

const ALT_FORMAT = 'F j, Y';
const ALT_FORMAT_TIME = 'F j, Y h:i K';

const DATE_FORMAT = 'MMMM D, YYYY';
const DATETIME_FORMAT = 'MMMM D, YYYY h:mm A';

@Component({
  selector: 'cp-datepicker',
  templateUrl: './cp-datepicker.component.html',
  styleUrls: ['./cp-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPDatePickerComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('input') input: ElementRef;
  @ViewChild('calendarEl') calendarEl: ElementRef;

  @Input() options: any;
  @Input() error: boolean;
  @Input() placeholder = '';
  @Input() clearable = false;

  @Output() dateSet = new EventEmitter<string>();
  @Output() dateClear = new EventEmitter<null>();

  el;
  date;
  locale;
  flatPicker;

  constructor() {
    this.flatPicker = require('flatpickr');
    this.locale = CPI18nService.getLocale();
  }

  ngAfterViewInit() {
    const host = this.calendarEl.nativeElement;
    const enableTime = this.options.enableTime;

    this.options = {
      ...this.options,
      inline: true,
      altInput: true,
      altFormat: enableTime ? ALT_FORMAT_TIME : ALT_FORMAT,
      onChange: (_, date) => {
        this.date = CPDate.format(date, enableTime ? DATETIME_FORMAT : DATE_FORMAT);
        if (!enableTime) {
          $(this.input.nativeElement).dropdown('toggle');
        }
        this.dateSet.emit(date);
      }
    };

    if (this.locale === 'fr-CA') {
      this.flatPicker.localize(French);
    }

    this.el = $(host).flatpickr(this.options);
  }

  toggleTime() {
    this.el.set('dateFormat', this.options.dateFormat);
    this.el.set('enableTime', this.options.enableTime);
  }

  clearDate() {
    this.date = '';
    this.dateClear.emit(null);
  }

  ngOnChanges() {
    if (this.el) {
      if (this.el.config.enableTime !== this.options.enableTime) {
        this.toggleTime();
      }

      if (this.error) {
        this.el.altInput.classList.add('error');

        return;
      }
      this.el.altInput.classList.remove('error');
    }
  }

  ngOnInit() {
    this.date = this.options.defaultDate
      ? CPDate.format(
          this.options.defaultDate,
          this.options.enableTime ? DATETIME_FORMAT : DATE_FORMAT
        )
      : '';
  }
}
