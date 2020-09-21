import { Component, OnInit } from '@angular/core';
import { ContactTraceFeatureLevel, CPSession } from '@campus-cloud/session';

@Component({
  selector: 'cp-health-dashboard',
  templateUrl: './health-dashboard.component.html',
  styleUrls: ['./health-dashboard.component.scss']
})
export class HealthDashboardComponent implements OnInit {
  isContactTracePlus: boolean;

  constructor(private session: CPSession) {}

  ngOnInit() {
    this.isContactTracePlus =
      this.session.g.get('school').contact_trace_feature_level === ContactTraceFeatureLevel.Plus;
  }
}
