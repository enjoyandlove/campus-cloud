import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../../../base';
import { CPSession } from './../../../../../session';
import { DashboardService } from './../../dashboard.service';


@Component({
  selector: 'cp-dashboard-general-information',
  templateUrl: './dashboard-general-information.component.html',
  styleUrls: ['./dashboard-general-information.component.scss']
})
export class DashboardGeneralInformationComponent extends BaseComponent implements OnInit {
  data;
  _dates;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  loading;

  constructor(
    private session: CPSession,
    private service: DashboardService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }


  fetch() {
    const search = new URLSearchParams();

    search.append('end', this._dates.end);
    search.append('start', this._dates.start);
    search.append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getGeneralInformation(search);
    super
      .fetchData(stream$)
      .then(res => this.data = res.data)
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetch();
  }
}
