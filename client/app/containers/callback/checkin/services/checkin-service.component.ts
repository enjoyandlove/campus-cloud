import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../session';
import { CheckinService } from '../checkin.service';
import { CheckinUtilsService } from '../checkin.utils.service';
import { BaseComponent } from '../../../../base/base.component';
import { ISnackbar, baseActions } from '../../../../store/base';
import { CheckInOutTime, CheckInType } from '../../callback.status';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../shared/services';

interface IState {
  services: Array<any>;
}

const state: IState = {
  services: []
};

@Component({
  selector: 'cp-checkin-service',
  templateUrl: './checkin-service.component.html',
  styleUrls: ['./checkin-service.component.scss']
})
export class CheckinServiceComponent extends BaseComponent implements OnInit {
  loading;
  checkInSource;
  isExist = true;
  isService = true;
  serviceId: string;
  state: IState = state;
  serviceProviderId: string;
  search: HttpParams;

  constructor(
    public router: Router,
    public session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public utils: CheckinUtilsService,
    public cpTracking: CPTrackingService,
    public checkinService: CheckinService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.serviceId = this.route.snapshot.params['service'];
    this.checkInSource = this.route.snapshot.queryParams['source'];
    this.serviceProviderId = this.route.snapshot.params['provider'];
  }

  onSubmit(data) {
    this.checkinService.doServiceCheckin(data, this.search).subscribe(
      (res) => {
        this.trackCheckedInEvent(res);
        this.updateAttendeesList(data, res);
      },
      (err) => this.handleError(err.status)
    );
  }

  updateAttendeesList(data, res) {
    data = {
      ...data,
      attendance_id: res.attendance_id,
      check_in_type: CheckInType.web,
      check_out_time_epoch: CheckInOutTime.empty
    };

    this.state.services = Object.assign({}, this.state.services, {
      attendees: [data, ...this.state.services['attendees']]
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

  onCheckout(service) {
    this.state.services = {
      ...this.state.services,
      ...service.data
    };

    const eventProperties = this.utils.getCheckedInEventProperties(
      this.serviceId,
      this.state.services,
      service.attendance_id,
      this.checkInSource
    );

    delete eventProperties.check_out_status;

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CHECKED_OUT,
      eventProperties
    );
  }

  fetch() {
    super
      .fetchData(this.checkinService.getServiceData(this.search, true))
      .then((res) => {
        this.state = Object.assign({}, this.state, { services: res.data });
      })
      .catch((_) => this.router.navigate(['/login']));
  }

  trackLoadCheckInEvent() {
    const eventProperties = {
      source_id: this.serviceId,
      check_in_type: amplitudeEvents.SERVICE_PROVIDER
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_LOADED_WEB_CHECK_IN,
      eventProperties
    );
  }

  trackCheckedInEvent(response) {
    const eventProperties = this.utils.getCheckedInEventProperties(
      this.serviceId,
      this.state.services,
      response.attendance_id,
      this.checkInSource
    );

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CHECKED_IN,
      eventProperties
    );
  }

  ngOnInit() {
    if (!this.session.g.get('user')) {
      this.cpTracking.loadAmplitude();
    }

    if (!this.checkInSource) {
      this.trackLoadCheckInEvent();
    }

    this.search = new HttpParams()
      .set('service_id', this.serviceId)
      .set('provider_id', this.serviceProviderId);

    if (!this.serviceId || !this.serviceProviderId) {
      this.router.navigate(['/login']);
    }
    this.fetch();
  }
}
