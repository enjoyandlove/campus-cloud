import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { CPSession } from './../../../../../../session';
import { CalendarsService } from '../../calendars.services';
import { CPTrackingService } from '../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-calendars-items-delete',
  templateUrl: './calendars-items-delete.component.html',
  styleUrls: ['./calendars-items-delete.component.scss']
})
export class CalendarsItemsDeleteComponent implements OnInit {
  @Input() item: any;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;
  eventProperties;
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
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.CALENDAR_EVENTS
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
