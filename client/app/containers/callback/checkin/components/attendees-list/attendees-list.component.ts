import { Component, Input } from '@angular/core';

import { FORMAT } from '../../../../../shared/pipes';
import { CheckInOutTime } from '../../../callback.status';

@Component({
  selector: 'cp-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss']
})
export class CheckinAttendeesListComponent {
  @Input() attendees: Array<any>;

  dateFormat = FORMAT.DATETIME;
  empty = CheckInOutTime.empty;
}
