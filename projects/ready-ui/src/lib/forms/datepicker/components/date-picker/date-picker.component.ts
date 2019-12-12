import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import * as moment_ from 'moment';

const moment = moment_;

import { DatePickerDirective } from '../../directives/date-picker.directive';

@Component({
  selector: 'ready-ui-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ready-ui-date-picker'
  }
})
export class DatePickerComponent implements OnInit {
  @ViewChild('datePicker', { static: true }) private datePicker: DatePickerDirective;

  @Input()
  withTime = false;

  @Input()
  rangePicker = false;

  @Input()
  locale = 'en';

  @Input()
  timeLabel: string;

  @Input()
  initialDate: string | Date | number = Date.now();

  @Output()
  dateChange: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onDateChange(date: string) {
    this.initialDate = date;
    this.dateChange.emit(moment(date).unix());
  }

  onPreviewChange(timtestamp: number) {
    this.datePicker.setDate(new Date(timtestamp * 1000));
    this.dateChange.emit(moment(new Date(timtestamp * 1000)).unix());
  }
}
