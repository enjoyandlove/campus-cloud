import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { CheckinService } from '../checkin.service';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { ISnackbar, baseActions } from '@campus-cloud/store/base';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CheckinUtilsService } from '../checkin.utils.service';
import { CheckInOutTime, CheckInType } from '../../callback.status';

import {
  ErrorService,
  CPI18nService,
  CPTrackingService,
  CPAmplitudeService
} from '@campus-cloud/shared/services';

interface IState {
  events: Array<any>;
}

const state: IState = {
  events: []
};

@Component({
  selector: 'cp-checkin-events',
  templateUrl: './checkin-events.component.html',
  styleUrls: ['./checkin-events.component.scss']
})
export class CheckinEventsComponent extends BaseComponent implements OnInit {
  loading;
  isEvent = true;
  eventId: string;
  timeZone: string;
  search: HttpParams;
  checkInSource: string;
  state: IState = state;

  constructor(
    public router: Router,
    public session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public utils: CheckinUtilsService,
    public errorService: ErrorService,
    public cpTracking: CPTrackingService,
    public checkinService: CheckinService,
    public cpAmplitude: CPAmplitudeService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.eventId = this.route.snapshot.params['event'];
    this.checkInSource = this.route.snapshot.queryParams['source'];
  }

  onSubmit(data) {
    this.checkinService.doEventCheckin(data, this.search).subscribe(
      (res) => {
        this.trackCheckedInEvent();
        this.updateAttendeesList(data, res);
      },
      (err) => this.handleError(err.status)
    );
  }

  onCheckout(event) {
    this.state.events = {
      ...this.state.events,
      ...event.data
    };

    const properties = this.utils.getCheckedInEventProperties(
      this.eventId,
      this.state.events,
      true
    );

    const access_type = this.checkInSource
      ? amplitudeEvents.EMAIL_WEB_CHECK_IN
      : amplitudeEvents.CC_WEB_CHECK_IN;

    const eventProperties = {
      ...properties,
      access_type
    };

    delete eventProperties.check_out_status;

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_ADDED_WEB_CHECK_OUT, eventProperties);
  }

  updateAttendeesList(data, res) {
    if (!res.attendance_id) {
      this.handleError();

      return;
    }

    data = {
      ...data,
      attendance_id: res.attendance_id,
      check_in_type: CheckInType.web,
      check_out_time_epoch: CheckInOutTime.empty
    };

    this.state.events = Object.assign({}, this.state.events, {
      attendees: [data, ...this.state.events['attendees']]
    });
  }

  handleError(status = null) {
    const body = status
      ? this.utils.getErrorMessage(status)
      : this.cpI18n.translate('t_external_checkin_already_checked_in');

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body,
        sticky: true,
        autoClose: true,
        class: 'danger'
      }
    });
  }

  fetch() {
    super
      .fetchData(this.checkinService.getEventData(this.search, true))
      .then((res) => {
        this.timeZone = res.data.tz_zoneinfo_str;

        this.state = {
          ...this.state,
          events: res.data
        };

        if (this.checkInSource) {
          this.trackLoadCheckInEvent();
        }
      })
      .catch((_) => {
        this.router.navigate(['/login']);
      });
  }

  trackLoadCheckInEvent() {
    const eventProperties = {
      source_id: this.eventId,
      assessment_type: this.utils.getCheckInSource(this.state.events['store_category'])
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_EMAIL_WEB_CHECK_IN, eventProperties);
  }

  trackCheckedInEvent() {
    const properties = this.utils.getCheckedInEventProperties(
      this.eventId,
      this.state.events,
      true
    );

    const access_type = this.checkInSource
      ? amplitudeEvents.EMAIL_WEB_CHECK_IN
      : amplitudeEvents.CC_WEB_CHECK_IN;

    const eventProperties = {
      ...properties,
      access_type
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_ADDED_WEB_CHECK_IN, eventProperties);
  }

  ngOnInit() {
    if (!this.session.g.get('user')) {
      this.cpAmplitude.loadAmplitude();
    }

    this.search = new HttpParams().append('event_id', this.eventId);

    if (!this.eventId) {
      this.router.navigate(['/login']);
    }
    this.fetch();
  }
}
