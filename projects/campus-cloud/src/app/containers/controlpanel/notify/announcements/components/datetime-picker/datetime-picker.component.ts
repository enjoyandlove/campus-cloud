import {
  Input,
  Output,
  Component,
  HostBinding,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import * as moment from 'moment';

import { notifyAtEpochNow } from './../../model';
import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { AnnouncementUtilsService } from './../../announcement.utils.service';
const now = new Date();
const in5Minutes = new Date(AnnouncementUtilsService.validTimestamp);
@Component({
  selector: 'cp-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnouncementsDatetimePickerComponent {
  minDay = now;
  selectedDate = moment();
  minTime = `${in5Minutes.getHours()}:${in5Minutes.getMinutes()}`;
  selectedTime = this.minTime;

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
    this.selectedTime = time.toString();
  }

  onDateChange(date: string) {
    this.selectedDate = moment(date);
  }

  setTimeToDate() {
    const [hours, minutes] = this.selectedTime.split(':');

    this.selectedDate.hour(+hours);
    this.selectedDate.minute(+minutes);
  }

  disposeDropdown() {
    $('.wrapper__menu').dropdown('toggle');
  }
}
