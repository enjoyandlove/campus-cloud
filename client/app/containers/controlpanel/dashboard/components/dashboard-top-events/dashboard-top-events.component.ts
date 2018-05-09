import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-top-events',
  templateUrl: './dashboard-top-events.component.html',
  styleUrls: ['./dashboard-top-events.component.scss']
})
export class DashboardTopEventsComponent extends BaseComponent implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  items = [];

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  constructor(private session: CPSession, private service: DashboardService) {
    super();
    super.isLoading().subscribe((loading) => {
      this.loading = loading;
      this.ready.emit(!this.loading);
    });
  }

  parseResponse(items: Array<any>) {
    return new Promise((resolve) => {
      resolve(
        items.map((item) => {
          return {
            id: item.event_id,
            name: item.event_title,
            image: item.event_poster_thumb_url,
            attendees: item.num_of_attendees,
            feedback: item.num_of_feedbacks,
            rating: item.average_of_feedbacks
          };
        })
      );
    });
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('sort_by', 'engagements');
    search.append('end', this._dates.end.toString());
    search.append('start', this._dates.start.toString());
    search.append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.service.getTopEvents(search);

    super
      .fetchData(stream$)
      .then((res) => this.parseResponse(res.data.top_events))
      .then((res: any) => (this.items = res));
  }

  ngOnInit() {
    this.fetch();
  }
}
