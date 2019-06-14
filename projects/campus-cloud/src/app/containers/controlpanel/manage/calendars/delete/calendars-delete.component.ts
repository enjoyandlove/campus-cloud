import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarsService } from './../calendars.services';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService, CPI18nService } from '@campus-cloud/shared/services';
import { CalendarAmplitudeService } from '../calendar.amplitude.service';

@Component({
  selector: 'cp-calendars-delete',
  templateUrl: './calendars-delete.component.html',
  styleUrls: ['./calendars-delete.component.scss']
})
export class CalendarsDeleteComponent implements OnInit {
  @Input() calendar;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService,
    public calendarService: CalendarsService
  ) {}

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.calendarService.deleteCalendar(this.calendar.id, search).subscribe(() => {
      this.trackEvent();

      this.deleted.emit(this.calendar.id);

      $('#calendarDelete').modal('hide');

      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: false
      });
    });
  }

  trackEvent() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DELETED_CALENDAR,
      CalendarAmplitudeService.getCalendarEventProperties(this.calendar)
    );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
