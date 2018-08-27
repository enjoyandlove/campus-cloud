import { Component, Input } from '@angular/core';

import { FORMAT } from '../../../../../shared/pipes';
import { CheckInOutTime } from '../../../callback.status';

@Component({
  selector: 'cp-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss']
})
export class CheckinAttendeesListComponent {
  @Input() data;

  attendee;
  timezone;
  launchCheckOutModal = false;
  dateFormat = FORMAT.DATETIME;
  empty = CheckInOutTime.empty;

  onCheckOutModal(attendee) {
    this.attendee = attendee;
    this.launchCheckOutModal = true;

    setTimeout(
      () => {
        $('#checkOutModal').modal();
      },

      1
    );
  }

  onCreated(data) {
    this.attendee = null;
    this.launchCheckOutModal = true;

    const attendees = this.data.attendees
      .map((attendee) => attendee.attendance_id === data.attendance_id ? data : attendee);

    this.data = {
      ...this.data,
      attendees
    };
  }
}
