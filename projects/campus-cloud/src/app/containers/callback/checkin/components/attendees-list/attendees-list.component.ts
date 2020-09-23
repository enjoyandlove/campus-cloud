import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FORMAT } from '@campus-cloud/shared/pipes';
import ICheckIn from '../../checkin.interface';
import IAttendee from '../attendee.interface';
import { CheckInOutTime, CheckInType } from '../../../callback.status';
import { privacyConfigurationOn } from '@campus-cloud/shared/utils';
import { CPSession } from '@campus-cloud/session';

@Component({
  selector: 'cp-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss']
})
export class CheckinAttendeesListComponent {
  @Input() data: ICheckIn;
  @Input() timeZone: string;

  @Output() checkout: EventEmitter<{ data: ICheckIn; userId: number }> = new EventEmitter();

  timezone: string;
  attendee: IAttendee;
  launchCheckOutModal = false;
  empty = CheckInOutTime.empty;
  checkInType = CheckInType.web;
  dateFormat = FORMAT.DATETIME_SHORT;

  constructor(private session: CPSession) {}

  onCheckOutModal(attendee: IAttendee) {
    this.attendee = attendee;
    this.launchCheckOutModal = true;

    setTimeout(
      () => {
        $('#checkOutModal').modal({ keyboard: true, focus: true });
      },

      1
    );
  }

  showCheckOutButton(attendee: IAttendee) {
    const webCheckIn = attendee.check_in_type === CheckInType.web;

    const noCheckOutDate =
      !attendee.check_out_time_epoch || attendee.check_out_time_epoch === this.empty;

    return webCheckIn && noCheckOutDate;
  }

  onCheckOut(newAttendee: IAttendee) {
    this.attendee = null;
    this.launchCheckOutModal = true;

    const attendees = this.data.attendees.map((attendee: IAttendee) =>
      attendee.attendance_id === newAttendee.attendance_id ? newAttendee : attendee
    );

    this.data = {
      ...this.data,
      attendees
    };

    this.checkout.emit({ data: this.data, userId: newAttendee.attendance_id });
  }

  isPrivacyOn() {
    return privacyConfigurationOn(this.session.g);
  }
}
