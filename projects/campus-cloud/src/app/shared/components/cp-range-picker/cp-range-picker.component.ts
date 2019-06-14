import {
  OnInit,
  Input,
  Output,
  ViewChild,
  Component,
  OnDestroy,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';

import { CPSession } from './../../../session';
import { CPDate } from './../../utils/date/date';
import { FORMAT, CPDatePipe } from './../../pipes/date/date.pipe';
import { CPRangePickerUtilsService } from './cp-range-picker.utils.service';

export interface IDateRange {
  end: number;
  start: number;
  label: string;
}

interface IRangePickerOptions {
  inline: boolean;
  mode: string;
  altInput: boolean;
  maxDate: string;
  enableTime: boolean;
  altFormat: string;
}

const rangeOptions: IRangePickerOptions = {
  inline: true,
  mode: 'range',
  altInput: true,
  maxDate: null,
  enableTime: false,
  altFormat: 'F j, Y'
};

declare var $: any;
import 'flatpickr';

@Component({
  selector: 'cp-range-picker',
  templateUrl: './cp-range-picker.component.html',
  styleUrls: ['./cp-range-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPRangePickerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendarEl', { static: true }) calendarEl: ElementRef;

  @Input() label;
  @Input() dateRanges;
  @Input() icon: string;
  @Input() class: string;
  @Input() clearable = false;
  @Input() iconPositionLeft = false;
  @Input() pickerOptions: IRangePickerOptions = rangeOptions;

  @Output() rangeChange: EventEmitter<IDateRange> = new EventEmitter();

  picker;
  datePipe;
  dateFormat = FORMAT.SHORT;

  constructor(public session: CPSession, public utils: CPRangePickerUtilsService) {}

  onDateChanged(selectedDates) {
    if (selectedDates.length === 2) {
      const formattedStart = this.datePipe.transform(
        CPDate.toEpoch(selectedDates[0], this.session.tz),
        this.dateFormat
      );
      const formattedEnd = this.datePipe.transform(
        CPDate.toEpoch(selectedDates[1], this.session.tz),
        this.dateFormat
      );

      const date = {
        start: this.utils.dayStart(selectedDates[0]),
        end: this.utils.dayEnd(selectedDates[1]),
        label: `${formattedStart} - ${formattedEnd}`
      };

      this.setLabel(date);
      this.triggerChange(date);
    }
  }

  resetCalendar() {
    this.picker.clear();
  }

  ngAfterViewInit() {
    const host = this.calendarEl.nativeElement;
    this.pickerOptions = Object.assign({}, this.pickerOptions, {
      onChange: this.onDateChanged.bind(this)
    });

    this.picker = $(host).flatpickr(this.pickerOptions);
  }

  handleCustomDate(date) {
    this.setLabel(date);
    this.resetCalendar();
    this.triggerChange(date);
  }

  triggerChange(date) {
    this.rangeChange.emit(date);
  }

  setLabel(date) {
    this.label = date.label;
  }

  clearDates() {
    const date = {
      start: null,
      end: null,
      label: null
    };
    this.setLabel(date);
    this.resetCalendar();
    this.triggerChange(date);
  }

  ngOnDestroy() {
    this.picker.destroy();
  }

  ngOnInit() {
    this.datePipe = new CPDatePipe(this.session);
    const maxDate = CPDate.now(this.session.tz)
      .subtract(1, 'days')
      .startOf('day')
      .format();

    this.pickerOptions = {
      ...this.pickerOptions,
      maxDate: this.pickerOptions.maxDate ? this.pickerOptions.maxDate : maxDate
    };
  }
}
