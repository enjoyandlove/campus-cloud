import { Input, Output, Component, EventEmitter, ViewEncapsulation } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { FORMAT } from './../../pipes/date/date.pipe';
import { CPDatePipe } from '@campus-cloud/shared/pipes/date';
import { CPRangePickerUtilsService } from './cp-range-picker.utils.service';

export interface IDateRange {
  end: number;
  start: number;
  label: string;
}

const now = new Date();

@Component({
  selector: 'cp-range-picker',
  templateUrl: './cp-range-picker.component.html',
  styleUrls: ['./cp-range-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPRangePickerComponent {
  @Input() label;
  @Input() dateRanges;
  @Input() icon: string;
  @Input() class: string;
  @Input() clearable = false;
  @Input() minDate = now.setFullYear(now.getFullYear() - 5);
  @Input() maxDate = CPDate.now(this.session.tz)
    .subtract(1, 'days')
    .startOf('day')
    .format();

  @Output() rangeChange: EventEmitter<IDateRange> = new EventEmitter();

  dateFormat = FORMAT.SHORT;

  constructor(
    private session: CPSession,
    private datePipe: CPDatePipe,
    private utils: CPRangePickerUtilsService
  ) {}

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

  handleCustomDate(date) {
    this.setLabel(date);
    this.triggerChange(date);
  }

  triggerChange(date) {
    this.rangeChange.emit(date);
  }

  setLabel(date) {
    this.label = date.label;
  }
}
