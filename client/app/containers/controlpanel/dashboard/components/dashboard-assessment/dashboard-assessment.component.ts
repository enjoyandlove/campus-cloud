import { Component, OnInit, Input } from '@angular/core';

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
    const stream$ = this.service.getAssessment(this._dates.start, this._dates.end)
    super
      .fetchData(stream$)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetch();
  }
}
