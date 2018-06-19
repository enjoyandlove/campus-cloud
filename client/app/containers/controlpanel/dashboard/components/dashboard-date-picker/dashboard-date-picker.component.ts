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

import { CPSession } from './../../../../../session';
import { CPDate } from './../../../../../shared/utils/date/date';
import { DashboardUtilsService } from './../../dashboard.utils.service';
import { FORMAT, CPDatePipe } from './../../../../../shared/pipes/date/date.pipe';

interface IDateChange {
  end: number;
  start: number;
  label: string;
}

declare var $: any;
import 'flatpickr';

@Component({
  selector: 'cp-dashboard-date-picker',
  templateUrl: './dashboard-date-picker.component.html',
  styleUrls: ['./dashboard-date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDatePickerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendarEl') calendarEl: ElementRef;

  @Output() dateChange: EventEmitter<IDateChange> = new EventEmitter();

  picker;
  datePipe;
  selected = null;
  customDates = [];
  dateFormat = FORMAT.SHORT;
  pickerOptions;

  @Input()
  set state(state) {
    this.setLabel(state);
  }

  constructor(private helper: DashboardUtilsService, public session: CPSession) {}

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
        start: this.helper.dayStart(selectedDates[0]),
        end: this.helper.dayEnd(selectedDates[1]),
        label: `${formattedStart} - ${formattedEnd}`
      };

      this.setLabel(date);

      this.triggerChange();

      // $(this.calendarEl.nativeElement).dropdown('toggle');
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
    this.triggerChange();
    this.resetCalendar();
  }

  triggerChange() {
    this.dateChange.emit(this.selected);
  }

  setLabel(date) {
    this.selected = date;
  }

  ngOnDestroy() {
    this.picker.destroy();
  }

  ngOnInit() {
    this.datePipe = new CPDatePipe(this.session);
    this.customDates = [this.helper.last30Days(), this.helper.last90Days(), this.helper.lastYear()];

    this.pickerOptions = {
      utc: true,
      inline: true,
      mode: 'range',
      altInput: true,
      maxDate: CPDate.now(this.session.tz)
        .subtract(1, 'days')
        .startOf('day')
        .format(),
      enableTime: false,
      altFormat: 'F j, Y'
    };
  }
}
