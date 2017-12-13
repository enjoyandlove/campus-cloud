import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-assessment',
  templateUrl: './dashboard-assessment.component.html',
  styleUrls: ['./dashboard-assessment.component.scss']
})
export class DashboardAssessmentComponent extends BaseComponent implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

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
    super.isLoading().subscribe(loading => {
      this.loading = loading;
      this.ready.emit(!this.loading);
    });
  }


  fetch() {
    const stream$ = this.service.getAssessment();
    // this.service.getAssessment().subscribe(res => console.log('A', res));

    super
      .fetchData(stream$)
      .then(res => console.log('ASSESS', res))
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetch();
  }
}
