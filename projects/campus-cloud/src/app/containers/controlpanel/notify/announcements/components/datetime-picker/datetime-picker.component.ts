import {
  Input,
  Output,
  OnInit,
  Component,
  HostBinding,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import * as moment from 'moment';

import { notifyAtEpochNow } from './../../model';
import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';

@Component({
  selector: 'cp-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnouncementsDatetimePickerComponent implements OnInit {
  minTime;
  selectedTime;
  minDay = new Date();
  selectedDate = moment();

  @Input()
  label: string;

  @Input()
  clearable = false;

  @Output()
  dateSet: EventEmitter<number> = new EventEmitter();

  constructor(private session: CPSession) {}

  @HostBinding('class.cp-datetime-picker')
  triggerDropdown() {
    $('.wrapper__menu').dropdown();
  }

  ngOnInit() {
    $('.wrapper__group').on('show.bs.dropdown', () => {
      this.checkMinTime();
      /**
       * TODO: this is a hack do not follow this approach
       */
      Array.from(
        document.querySelectorAll('.wrapper__time__wrapper .flatpickr-time .numInput')
      ).forEach((i: HTMLInputElement) => (i.disabled = true));
    });
  }

  checkMinTime() {
    const isToday = this.selectedDate.get('day') === new Date().getDay();
    this.minTime = isToday ? this.inSixMinutes() : undefined;
    this.selectedTime = this.minTime ? this.minTime : this.inSixMinutes();
  }

  onCancel() {
    this.disposeDropdown();
  }

  onSetTime() {
    this.setTimeToDate();
    this.disposeDropdown();
    this.dateSet.emit(CPDate.toEpoch(this.selectedDate, this.session.tz));
  }

  clearDate() {
    this.dateSet.emit(notifyAtEpochNow);
  }

  onTimeChange(time: string) {
    if (!time) {
      return;
    }
    this.selectedTime = time.toString();
  }

  onDateChange(date: string) {
    this.selectedDate = date ? moment(date) : moment();
    this.checkMinTime();
  }

  setTimeToDate() {
    const [hours, minutes] = this.selectedTime.split(':');

    this.selectedDate.hour(+hours);
    this.selectedDate.minute(+minutes);
  }

  disposeDropdown() {
    $('.wrapper__menu').dropdown('toggle');
  }

  private inSixMinutes() {
    const date = new Date();
    const in6Minutes = new Date(date.setUTCSeconds(date.getUTCSeconds() + 6 * 60));
    return `${in6Minutes.getHours()}:${in6Minutes.getMinutes()}`;
  }
}
