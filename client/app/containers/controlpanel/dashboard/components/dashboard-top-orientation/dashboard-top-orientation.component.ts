import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-top-orientation',
  templateUrl: './dashboard-top-orientation.component.html',
  styleUrls: ['./dashboard-top-orientation.component.scss']
})
export class DashboardTopOrientationComponent extends BaseComponent implements OnInit {
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
            id: item.user_event_id,
            name: item.event_title,
            calendar_id: item.calendar_id,
            feedback: item.num_of_feedbacks,
            attendees: item.num_of_attendees,
            image: item.event_image_thumb_url,
            rating: item.average_of_feedbacks
          };
        })
      );
    });
  }

  fetch() {
    const search = new HttpParams()
      .append('sort_by', 'average')
      .append('end', this._dates.end.toString())
      .append('start', this._dates.start.toString())
      .append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.service.getTopOrientation(search);

    super
      .fetchData(stream$)
      .then((res) => this.parseResponse(res.data.top_events))
      .then((res: any) => (this.items = res));
  }

  ngOnInit() {
    this.fetch();
  }
}
