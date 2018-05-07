import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { CheckinService } from '../checkin.service';
import { BaseComponent } from '../../../../base/base.component';
import { CPI18nService, ErrorService } from '../../../../shared/services';

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
  search: URLSearchParams = new URLSearchParams();

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public errorService: ErrorService,
    public checkinService: CheckinService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.serviceId = this.route.snapshot.params['service'];
    this.serviceProviderId = this.route.snapshot.params['provider'];
  }

  onSubmit(data) {
    this.checkinService.doServiceCheckin(data, this.search).subscribe(
      (_) => this.updateAttendeesList(data),
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

  ngOnInit() {
    this.search.append('service_id', this.serviceId);
    this.search.append('provider_id', this.serviceProviderId);

    if (!this.serviceId || !this.serviceProviderId) {
      this.router.navigate(['/login']);
    }
    this.fetch();
  }
}
