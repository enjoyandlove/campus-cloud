import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CheckinService } from '../checkin.service';
import { BaseComponent } from '../../../../base/base.component';

interface IState {
  events: Array<any>;
}

const state: IState = {
  events: []
};

@Component({
  selector: 'cp-checkin-service',
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
      err => { throw new Error(err) }
      );
  }

  updateAttendeesList(data) {
    this.state.events = Object.assign(
      {},
      this.state.events,
      { external_attendees: [data, ...this.state.events['external_attendees']] }
    );
  }
  // cb/checkin/e/GJ-Fn5w06XY-7h-_oetnJw
  fetch() {
    super
      .fetchData(this.checkinService.getEventData(this.search))
      .then(res => {
        this.state = Object.assign({}, this.state, { events: res.data });
      })
      .catch(_ => {});
  }

  ngOnInit() {
    this.search.append('event_id', this.eventId);

    if (!this.eventId) {
      this.router.navigate(['/login']);
    }
    this.fetch();
  }
}
