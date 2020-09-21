import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-health-dashboard-form-completion-graph',
  templateUrl: './health-dashboard-form-completion-graph.component.html',
  styleUrls: ['./health-dashboard-form-completion-graph.component.scss']
})
export class HealthDashboardFormCompletionGraphComponent implements OnInit {
  @Input() labels;
  @Input() series;
  constructor() {}

  ngOnInit(): void {}
}
