import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../session';
import { CheckinService } from '../checkin.service';
import { CheckinUtilsService } from '../checkin.utils.service';
import { BaseComponent } from '../../../../base/base.component';
import { CheckInOutTime, CheckInType } from '../../callback.status';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { ISnackbar, SNACKBAR_SHOW } from '../../../../reducers/snackbar.reducer';
import { CPI18nService, CPTrackingService, ErrorService } from './../../../../shared/services';

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
  @Input() isOrientation: boolean;

  loading;
  isEvent = true;
  eventId: string;
  search: HttpParams;
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
    public checkinService: CheckinService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.eventId = this.route.snapshot.params['event'];
  }

  onSubmit(data) {
    this.checkinService.doEventCheckin(data, this.search).subscribe(
      (res) => {
        this.updateAttendeesList(data, res);
        this.trackAmplitudeEvent(true);
      },
      (err) => this.handleError(err.status)
    );
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
      type: SNACKBAR_SHOW,
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
        this.state = Object.assign({}, this.state, { events: res.data });
      })
      .catch((_) => {
        this.router.navigate(['/login']);
      });
  }

  trackAmplitudeEvent(checkedin = false) {
    const check_in_type = this.isOrientation ? amplitudeEvents.ORIENTATION : amplitudeEvents.EVENT;

    const eventName = checkedin
      ? amplitudeEvents.MANAGE_CHECKEDIN_MANUALLY
      : amplitudeEvents.MANAGE_LOADED_CHECKIN;

    const eventProperties = {
      event_id: this.eventId,
      check_in_type
    };

    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);
  }

  ngOnInit() {
    if (!this.session.g.get('user')) {
      this.cpTracking.loadAmplitude();
    }

    this.trackAmplitudeEvent();
    this.search = new HttpParams().append('event_id', this.eventId);

    if (!this.eventId) {
      this.router.navigate(['/login']);
    }
    this.fetch();
  }
}
