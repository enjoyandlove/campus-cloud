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

  data;
  _dates;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  loading;

  constructor(private service: DashboardService) {
    super();
  }

  fetch() {
    this.loading = true;
    const stream$ = this.service.getAssessment();

    stream$.subscribe(
      (res: any) => {
        this.loading = false;
        this.data = {
          event_checkins: res[0].event_checkins,
          event_feedback_rate: res[0].event_feedback_rate,
          event_total_feedback: res[0].event_total_feedback,
          service_checkins: res[1].service_checkins,
          service_feedback_rate: res[1].service_feedback_rate,
          service_total_feedback: res[1].service_total_feedback
        };
      },
      (_) => {
        this.loading = false;
      }
    );
  }

  ngOnInit() {
    this.fetch();
  }
}
