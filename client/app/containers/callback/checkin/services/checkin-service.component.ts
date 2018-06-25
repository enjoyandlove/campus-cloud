import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CheckinService } from '../checkin.service';
import { BaseComponent } from '../../../../base/base.component';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService, ErrorService } from '../../../../shared/services';

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
  isExist = true;
  isService = true;
  serviceId: string;
  state: IState = state;
  serviceProviderId: string;
  search: HttpParams;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public errorService: ErrorService,
    public cpTracking: CPTrackingService,
    public checkinService: CheckinService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.serviceId = this.route.snapshot.params['service'];
    this.serviceProviderId = this.route.snapshot.params['provider'];
  }

  onSubmit(data) {
    this.checkinService.doServiceCheckin(data, this.search).subscribe(
      (_) => {
        this.updateAttendeesList(data);
        this.trackAmplitudeEvent(true);
      },
      (_) => {
        this.errorService.handleError(this.cpI18n.translate('something_went_wrong'));
      }
    );
  }

  updateAttendeesList(data) {
    this.state.services = Object.assign({}, this.state.services, {
      attendees: [data, ...this.state.services['attendees']]
    });
  }

  fetch() {
    super
      .fetchData(this.checkinService.getServiceData(this.search, true))
      .then((res) => {
        this.state = Object.assign({}, this.state, { services: res.data });
      })
      .catch((_) => this.router.navigate(['/login']));
  }

  trackAmplitudeEvent(checkedin = false) {
    const eventName = checkedin
      ? amplitudeEvents.MANAGE_CHECKEDIN_MANUALLY
      : amplitudeEvents.MANAGE_LOADED_CHECKIN;

    const eventProperties = {
      service_id: this.serviceId,
      check_in_type: amplitudeEvents.SERVICE
    };

    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);
  }

  ngOnInit() {
    this.trackAmplitudeEvent();
    this.search = new HttpParams()
      .set('service_id', this.serviceId)
      .set('provider_id', this.serviceProviderId);

    if (!this.serviceId || !this.serviceProviderId) {
      this.router.navigate(['/login']);
    }
    this.fetch();
  }
}
