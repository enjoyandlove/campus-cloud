import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-health-dashboard-form-completion-source',
  templateUrl: './health-dashboard-form-completion-source.component.html',
  styleUrls: ['./health-dashboard-form-completion-source.component.scss']
})
export class HealthDashboardFormCompletionSourceComponent implements OnInit {
  @Input() sources;

  constructor() {}

  ngOnInit(): void {}
}
