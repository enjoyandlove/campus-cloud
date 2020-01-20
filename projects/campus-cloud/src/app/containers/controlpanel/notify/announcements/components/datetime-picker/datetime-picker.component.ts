import {
  Input,
  Output,
  OnInit,
  Component,
  EventEmitter,
  ViewEncapsulation,
  HostBinding
} from '@angular/core';

import { notifyAtEpochNow } from './../../model';
import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';

const now = new Date();

@Component({
  selector: 'cp-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnouncementsDatetimePickerComponent implements OnInit {
  minTime;
  selectedTime;
  minDay = new Date().setTime(now.getTime() + 60 * 6 * 1000);
  selectedDate = this.minDay;

  @Input()
  label: string;

  @Input()
  clearable = false;

  @Output()
  dateSet: EventEmitter<number> = new EventEmitter();

  constructor(private session: CPSession) {}

  @HostBinding('class.cp-datetime-picker')
  ngOnInit() {}

  clearDate(event: Event) {
    event.stopPropagation();
    this.selectedDate = this.minDay;
    this.dateSet.emit(notifyAtEpochNow);
  }

  onDateChange(date: string) {
    const timtestamp = CPDate.toEpoch(date, this.session.tz);
    this.dateSet.emit(timtestamp);
    this.selectedDate = timtestamp * 1000;
  }
}
