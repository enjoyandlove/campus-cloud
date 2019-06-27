import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { CPSession } from '@campus-cloud/session';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CalendarsService } from '../../calendars.services';
import { CPTrackingService, CPI18nService } from '@campus-cloud/shared/services';
import { CalendarAmplitudeService } from '../../calendar.amplitude.service';

@Component({
  selector: 'cp-calendars-items-delete',
  templateUrl: './calendars-items-delete.component.html',
  styleUrls: ['./calendars-items-delete.component.scss']
})
export class CalendarsItemsDeleteComponent implements OnInit {
  @Input() item: any;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;
  calendarId: number;

  constructor(
    public session: CPSession,
    public route: ActivatedRoute,
    private cpI18n: CPI18nService,
    private cpTracking: CPTrackingService,
    private calendarService: CalendarsService
  ) {
    this.calendarId = this.route.snapshot.params['calendarId'];
  }

  onDelete() {
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('academic_calendar_id', this.calendarId.toString());

    this.calendarService.delteItemById(this.item.id, search).subscribe(() => {
      this.trackEvent();

      this.deleted.emit(this.item.id);

      $('#deleteCalendarItemModal').modal('hide');

      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
    });
  }

  trackEvent() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DELETED_CALENDAR_EVENT,
      CalendarAmplitudeService.getCalendarEventItemProperties(this.item)
    );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
