import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CheckinService } from '../checkin.service';
import { BaseComponent } from '../../../../base/base.component';

interface IState {
  services: Array<any>;
}

const state: IState = {
  services: []
};

@Component({
  selector: 'cp-checkin-service',
  templateUrl: './checkin-events.component.html',
  styleUrls: ['./checkin-events.component.scss']
})
export class CheckinEventsComponent extends BaseComponent implements OnInit {
  loading;
  eventId: string;
  state: IState = state;
  search: URLSearchParams = new URLSearchParams();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private checkinService: CheckinService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.eventId = this.route.snapshot.params['event'];
  }

  onSubmit(data) {
    this
      .checkinService
      .doEventCheckin(data, this.search)
      .subscribe(
        _ => this.updateAttendeesList(data),
        err => console.error(err)
      );
  }

  updateAttendeesList(data) {
    this.state.services = Object.assign(
      {},
      this.state.services,
      { external_attendees: [data, ...this.state.services['external_attendees'] ] }
    );
  }
  // cb/checkin/services;service=XeqmohCZNONC05rEcBItaw;provider=rA5myiH9NEpMczvDufnVCw
  fetch() {
    super
      .fetchData(this.checkinService.getEventData(this.search))
      .then(res => {
        console.log(res.data);
        this.state = Object.assign({}, this.state, { services: res.data });
      })
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.search.append('event_id', this.eventId);

    if (!this.eventId) {
      this.router.navigate(['/login']);
    }
    this.fetch();
  }
}
