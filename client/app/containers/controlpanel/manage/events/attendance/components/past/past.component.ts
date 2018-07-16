import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { EventsService } from '../../../events.service';
import { CPSession } from './../../../../../../../session';
import { EventUtilService } from '../../../events.utils.service';
import { CPDate } from './../../../../../../../shared/utils/date/date';
import { CPTrackingService } from '../../../../../../../shared/services';
import { BaseComponent } from '../../../../../../../base/base.component';
import { STAR_SIZE } from '../../../../../../../shared/components/cp-stars';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { createSpreadSheet } from './../../../../../../../shared/utils/csv/parser';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

interface IState {
  sort_field: string;
  sort_direction: string;
  search_text: string;
}

const state = {
  sort_field: 'firstname',
  sort_direction: 'asc',
  search_text: null
};

@Component({
  selector: 'cp-attendance-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.scss']
})
export class AttendancePastComponent extends BaseComponent implements OnInit {
  @Input() event: any;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  loading;
  attendees;
  sortingLabels;
  attendeeFeedback;
  state: IState = state;
  downloadEentProperties;
  listStarSize = STAR_SIZE.DEFAULT;
  detailStarSize = STAR_SIZE.LARGE;

  eventProperties = {
    data_type: null,
    event_id: null,
    start_date: null,
    end_date: null,
    location: null
  };

  constructor(
    public session: CPSession,
    private cpI18n: CPI18nService,
    public service: EventsService,
    public utils: EventUtilService,
    public cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  public fetch() {
    let search = new HttpParams()
      .append('event_id', this.event.id)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('search_text', this.state.search_text);

    if (this.isOrientation) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }
    const stream$ = this.service.getEventAttendanceByEventId(
      this.startRange,
      this.endRange,
      search
    );

    super
      .fetchData(stream$)
      .then((res) => (this.attendees = res.data))
      .catch((_) => {});
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  doSort(sort_field) {
    this.state = Object.assign({}, this.state, {
      sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    });
    this.fetch();
  }

  onCreateExcel() {
    let search = new HttpParams().append('event_id', this.event.id).append('all', '1');

    if (this.isOrientation) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }
    const stream$ = this.service.getEventAttendanceByEventId(
      this.startRange,
      this.endRange,
      search
    );

    this.trackAmplitudeEvent();

    stream$.toPromise().then((attendees: Array<any>) => {
      const columns = [
        this.cpI18n.translate('events_attendant'),
        this.cpI18n.translate('events_attendee_email'),
        this.cpI18n.translate('events_checked_in_time'),
        this.cpI18n.translate('rating'),
        this.cpI18n.translate('events_user_feedback'),
        this.cpI18n.translate('events_checked_in_method'),
        this.cpI18n.translate('student_id')
      ];

      const check_in_method = {
        1: 'Web',
        3: 'QR Code'
      };

      attendees = attendees.map((item) => {
        return {
          [this.cpI18n.translate('events_attendant')]: `${item.firstname} ${item.lastname}`,

          [this.cpI18n.translate('events_attendee_email')]: item.email,

          [this.cpI18n.translate('events_checked_in_time')]: CPDate.fromEpoch(
            item.check_in_time,
            this.session.tz
          ).format('MMMM Do YYYY - h:mm a'),

          [this.cpI18n.translate('rating')]:
            item.feedback_rating === -1 ? '' : (item.feedback_rating * 5 / 100).toFixed(2),

          [this.cpI18n.translate('events_user_feedback')]: item.feedback_text,

          [this.cpI18n.translate('events_checked_in_method')]: check_in_method[
            item.check_in_method
          ],

          [this.cpI18n.translate('student_id')]: item.student_identifier
        };
      });

      createSpreadSheet(attendees, columns);
    });
  }

  trackAmplitudeEvent() {
    this.downloadEentProperties = {
      data_type: amplitudeEvents.EVENT
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DOWNLOAD_DATA,
      this.downloadEentProperties);
  }

  onViewFeedback(attendee): void {
    this.trackFeedbackEvent();
    attendee = Object.assign({}, attendee, {
      maxRate: this.event.rating_scale_maximum
    });

    this.attendeeFeedback = attendee;
  }

  trackFeedbackEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      event_id: this.event.id,
      location: this.utils.getLocation(this.event.location),
      start_date: CPDate.getMonth(this.event.start, this.session.tz),
      end_date: CPDate.getMonth(this.event.end, this.session.tz)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CLICKED_FEEDBACK,
      this.eventProperties);
  }

  doSearch(search_text): void {
    search_text = search_text === '' ? null : search_text;
    this.state = Object.assign({}, this.state, { search_text });

    this.resetPagination();

    this.fetch();
  }

  onResetModal(): void {
    /**
     * in order to clean the stars component
     */
    this.attendeeFeedback = null;
  }

  ngOnInit() {
    this.fetch();

    this.sortingLabels = {
      rating: this.cpI18n.translate('rating'),
      name: this.cpI18n.translate('attendee'),
      method: this.cpI18n.translate('events_checked_in_method')
    };
  }
}
