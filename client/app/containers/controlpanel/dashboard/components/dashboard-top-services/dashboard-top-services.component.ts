import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-top-services',
  templateUrl: './dashboard-top-services.component.html',
  styleUrls: ['./dashboard-top-services.component.scss']
})
export class DashboardTopServicesComponent extends BaseComponent implements OnInit {
  _dates;
  loading;
  items = [];

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  constructor(
    private session: CPSession,
    private service: DashboardService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading)
  }

  parseResponse(items: Array<any>) {
    return new Promise(resolve => {
      resolve(items.map(item => {
        return {
          'id': item.campus_service_id,
          'name': item.service_name,
          'image': item.service_logo_url,
          'attendees': item.num_of_attendees,
          'feedback': item.num_of_feedbacks,
          'rating': item.average_of_feedbacks,
        }
      }))
    })
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('sort_by', 'engagements');
    search.append('end', this._dates.end.toString());
    search.append('start', this._dates.start.toString());
    search.append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.service.getTopServices(search);

    super
      .fetchData(stream$)
      .then(res => this.parseResponse(res.data.top_services))
      .then((res: any) => this.items = res)
      .catch(err => console.log(err))
  }

  ngOnInit() {
    this.fetch();
  }
}
