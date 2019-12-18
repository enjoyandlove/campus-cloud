import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment_ from 'moment';

const moment = moment_;

type triggers = 'day' | 'month' | 'year' | 'hours' | 'minutes' | 'period';

@Component({
  selector: 'ready-ui-date-previewer',
  templateUrl: './date-previewer.component.html',
  styleUrls: ['./date-previewer.component.scss']
})
export class DatePreviewerComponent implements OnInit {
  _period = 'AM';
  _date = moment();
  _minutes = this.setLeadingZero(this._date.minutes());
  _hours =
    this._date.hours() > 12
      ? this.setLeadingZero(this._date.hours() - 12)
      : this.setLeadingZero(this._date.hours());

  activeButton: triggers | undefined;

  @Input()
  set date(date: number | string) {
    this._date = moment(date);
    this._minutes = this.setLeadingZero(this._date.minutes());
    const hour =
      this._date.hours() > 12
        ? this.setLeadingZero(this._date.hours() - 12)
        : this.setLeadingZero(this._date.hours());

    this._hours = hour === '00' ? '12' : hour;
  }

  @Output()
  dateChange: EventEmitter<number> = new EventEmitter();

  constructor() {}

  get day() {
    return this.formattedDate().day;
  }

  get month() {
    return this.formattedDate().month;
  }

  get year() {
    return this.formattedDate().year;
  }

  get hours() {
    return this._hours;
  }

  get minutes() {
    return this._minutes;
  }

  get period() {
    return this._period;
  }

  ngOnInit() {}

  setLeadingZero(minutesOrHours: number | string) {
    const str = String(minutesOrHours);
    return str.length === 1 ? `0${str}` : str;
  }

  onIncrement() {
    switch (this.activeButton) {
      case 'day':
        this._date.add(1, 'days');
        break;
      case 'month':
        this._date.add(1, 'months');
        break;
      case 'year':
        this._date.add(1, 'year');
        break;
      case 'hours':
        this._hours =
          Number(this._hours) === 12 ? '01' : this.setLeadingZero(Number(this._hours) + 1);
        break;
      case 'minutes':
        this._minutes =
          Number(this._minutes) === 59 ? '00' : this.setLeadingZero(Number(this._minutes) + 1);
        break;
      case 'period':
        this.togglePeriod();
        break;
    }
    this.emitChange();
  }

  onPeriodInput(event, requiredLength = 2) {
    const value = event.target.value;
    const { patternMismatch, tooLong } = event.target.validity;
    const invalid = (patternMismatch && value.length === requiredLength) || tooLong;

    event.target.value = invalid ? 'AM' : value.toUpperCase();
    this.emitChange();
  }

  onPeriodBlur(event) {
    this.onPeriodInput(event, event.target.value.length);
  }

  togglePeriod() {
    this._period = this.period === 'AM' ? 'PM' : 'AM';
  }

  onDecrement() {
    switch (this.activeButton) {
      case 'day':
        this._date.subtract(1, 'days');
        break;
      case 'month':
        this._date.subtract(1, 'months');
        break;
      case 'year':
        this._date.subtract(1, 'year');
        break;
      case 'hours':
        this._hours =
          Number(this._hours) === 1 ? '12' : this.setLeadingZero(Number(this._hours) - 1);
        break;
      case 'minutes':
        this._minutes =
          Number(this._minutes) === 0 ? '59' : this.setLeadingZero(Number(this._minutes) - 1);
        break;
      case 'period':
        this.togglePeriod();
        break;
    }
    this.emitChange();
  }

  setActive(metric: triggers) {
    this.activeButton = metric;
  }

  preventStrings(event) {
    const charCode = typeof event.which === 'undefined' ? event.keyCode : event.which;
    const charStr = String.fromCharCode(charCode);

    if (!charStr.match(/^[0-9]+$/)) {
      event.preventDefault();
    }
  }

  onValidate(event, target) {
    let { min, value, max } = event.target;

    max = Number(max);
    min = Number(min);
    value = Number(value);

    if (value > max) {
      value = max;
    }

    if (value < min) {
      value = min;
    }

    if (!value) {
      const val = this.setLeadingZero(min);
      event.target.value = val;
      this[target] = val;
      this.emitChange();
    } else {
      const val = this.setLeadingZero(value);
      event.target.value = val;
      this[target] = val;
      this.emitChange();
    }
  }

  filterKeyUpAndDowns(event: KeyboardEvent) {
    const disabledKeys = ['ArrowDown', 'ArrowUp'];
    const { code } = event;

    if (disabledKeys.includes(code)) {
      event.preventDefault();
    }
  }

  focusInputValue(event: Event) {
    const input = <HTMLInputElement>event.target;
    input.focus();
    input.select();
  }

  emitChange() {
    const date = this._date.clone();
    let hours = this.period === 'PM' ? Number(this._hours) + 12 : Number(this._hours);

    if (hours === 24 && this.period === 'PM') {
      hours = 12;
    } else if (hours === 12 && this.period === 'AM') {
      hours = 0;
    }

    date.hour(hours);
    date.minute(Number(this._minutes));

    if (date.day() !== this._date.day()) {
      date.day(this._date.day());
    }

    this.dateChange.emit(date.unix());
  }

  private formattedDate() {
    const [month, day, year, hours, minutes, period] = this._date
      .format('MMM, DD, YYYY, hh,mm, A')
      .split(',');

    return {
      day,
      year,
      month,
      hours,
      period,
      minutes
    };
  }
}
