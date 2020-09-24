import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-health-dashboard-location-visits',
  templateUrl: './health-dashboard-location-visits.component.html',
  styleUrls: ['./health-dashboard-location-visits.component.scss']
})
export class HealthDashboardLocationVisitsComponent implements OnInit {
  @Input() locationVisits;
  constructor() {}

  ngOnInit(): void {}
}
