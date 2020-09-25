import { Component, Input, OnInit } from '@angular/core';
import { CPI18nPipe } from '@projects/campus-cloud/src/app/shared/pipes';

@Component({
  selector: 'cp-health-dashboard-form-completion-activity',
  templateUrl: './health-dashboard-form-completion-activity.component.html',
  styleUrls: ['./health-dashboard-form-completion-activity.component.scss']
})
export class HealthDashboardFormCompletionActivityComponent implements OnInit {
  @Input() activities = {
    never_submitted: 0,
    not_submitted_today: 0,
    unique_submissions_today: 0
  };
  constructor(cpI18n: CPI18nPipe) {}
  ngOnInit(): void {}
}
