import { URLSearchParams } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CheckinService } from '../checkin.service';
import { BaseComponent } from '../../../../base/base.component';
import { ErrorService, CPI18nService } from './../../../../shared/services';

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
  state: IState = state;
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

    this.eventId = this.route.snapshot.params['event'];
  }

  onSubmit(data) {
    this.checkinService
      .doEventCheckin(data, this.search)
      .subscribe(
        (_) => this.updateAttendeesList(data),
        (_) => this.errorService.handleError(this.cpI18n.translate('something_went_wrong'))
      );
  }

  updateAttendeesList(data) {
    this.state.events = Object.assign({}, this.state.events, {
      attendees: [data, ...this.state.events['attendees']]
    });
  }
  // cb/checkin/e/GJ-Fn5w06XY-7h-_oetnJw
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

  ngOnInit() {
    this.search.append('event_id', this.eventId);

    if (!this.eventId) {
      this.router.navigate(['/login']);
    }
    this.fetch();
  }
}
