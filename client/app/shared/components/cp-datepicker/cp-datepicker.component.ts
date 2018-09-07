import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { CPI18nService } from '../../services';
/**
 * https://chmln.github.io/flatpickr/
 */

declare var $: any;
import * as French from 'flatpickr/dist/l10n/fr.js';

@Component({
  selector: 'cp-datepicker',
  templateUrl: './cp-datepicker.component.html',
  styleUrls: ['./cp-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPDatePickerComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('input') input: ElementRef;

  @Input() options: any;
  @Input() error: boolean;
  @Input() placeholder = '';

  el;
  locale;
  flatPicker;

  constructor() {
    this.flatPicker = require('flatpickr');
    this.locale = CPI18nService.getLocale();
  }

  ngAfterViewInit() {
    const el = this.input.nativeElement;
    this.options = { ...this.options };

    if (this.locale === 'fr-CA') {
      this.flatPicker.localize(French.fr);
    }

    this.el = $(el).flatpickr(this.options);
  }

  toggleTime() {
    this.el.set('dateFormat', this.options.dateFormat);
    this.el.set('enableTime', this.options.enableTime);
  }

  clearDate() {
    this.el.clear();
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

  ngOnInit() {}
}
