import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-assessment',
  templateUrl: './dashboard-assessment.component.html',
  styleUrls: ['./dashboard-assessment.component.scss']
})
export class DashboardAssessmentComponent extends BaseComponent implements OnInit {
  _dates;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  loading;

  constructor(
    private service: DashboardService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }


  fetch() {
    const search = new URLSearchParams();
    search.append('start', this._dates.start);
    search.append('end', this._dates.end);

    const stream$ = this.service.getAssessment(search);

    super
      .fetchData(stream$)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetch();
  }
}
