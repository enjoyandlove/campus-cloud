import {
  OnInit,
  Input,
  Output,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';
import flatpickr from 'flatpickr';
import * as moment from 'moment';

import { CPI18nService } from '@campus-cloud/shared/services';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

const ALT_FORMAT = 'F j, Y';
const ALT_FORMAT_TIME = 'F j, Y h:i K';

@Directive({
  exportAs: 'datePicker',
  selector: '[cpDatePicker]'
})
export class CPDatePickerDirective implements OnInit {
  private _minDate: Date;
  private _inline = false;
  private _maxDate: Date;
  private _isOpen = false;
  private _static = false;
  private _altInput = true;
  private _enableTime = false;
  private _mode: 'single' | 'multiple' | 'range' = 'single';

  @Input() defaultDate: Date;

  @Input()
  set altInput(altInput: string) {
    this._altInput = coerceBooleanProperty(altInput);
  }

  @Input()
  set inline(inline: string) {
    this._inline = coerceBooleanProperty(inline);
  }

  @Input()
  set static(staticMode: string) {
    this._static = coerceBooleanProperty(staticMode);
  }

  @Input()
  set enableTime(enableTime: boolean | string) {
    this._enableTime = coerceBooleanProperty(enableTime);
  }

  @Input()
  set minDate(minDate: Date) {
    this._minDate = minDate;

    if (!this.picker) {
      return;
    }

    this.picker.set('minDate', minDate);
  }

  @Input()
  set maxDate(maxDate: Date) {
    this._maxDate = maxDate;
    if (!this.picker) {
      return;
    }

    this.picker.set('maxDate', maxDate);
  }

  @Input()
  set mode(mode: 'single' | 'multiple' | 'range') {
    this._mode = mode;

    if (!this.picker) {
      return;
    }

    this.picker.set('mode', mode);
  }

  @Output() dateChange: EventEmitter<any> = new EventEmitter();

  private picker: flatpickr.Instance;

  get dateFormat(): string {
    return this._enableTime ? ALT_FORMAT_TIME : ALT_FORMAT;
  }

  constructor(private el: ElementRef) {}

  @HostListener('focus')
  focusListener() {
    this.open();
  }

  ngOnInit() {
    this.picker = <flatpickr.Instance>flatpickr(this.el.nativeElement, this.getConfig());
    this.picker.set('altInput', true);
  }

  open() {
    if (this._isOpen) {
      return;
    }

    this.picker.open();
  }

  clear() {
    this.picker.clear(true);
  }

  private onClose() {
    if (!this._isOpen) {
      return;
    }

    this._isOpen = false;
  }

  private onOpen() {
    this._isOpen = true;
  }

  private onChange(selectedDates: Date[], dateStr: string) {
    if (this._mode === 'range') {
      if (selectedDates.length !== 2) {
        return;
      }

      const [startDate, endDate] = selectedDates;
      this.dateChange.emit([
        moment(startDate, this.dateFormat).startOf('day'),
        moment(endDate, this.dateFormat).endOf('day')
      ]);
    } else {
      this.dateChange.emit(dateStr ? dateStr : null);
    }
  }

  private getConfig(): flatpickr.Options.Options {
    return {
      mode: this._mode,
      position: 'below',
      clickOpens: true,
      inline: this._inline,
      static: this._static,
      minDate: this._minDate,
      maxDate: this._maxDate,
      altInput: this._altInput,
      altFormat: this.dateFormat,
      enableTime: this._enableTime,
      onOpen: this.onOpen.bind(this),
      onClose: this.onClose.bind(this),
      onChange: this.onChange.bind(this),
      locale: CPI18nService.getLocale() === 'en-US' ? 'en' : 'fr',
      defaultDate: this.defaultDate ? new Date(this.defaultDate) : undefined
    };
  }
}
