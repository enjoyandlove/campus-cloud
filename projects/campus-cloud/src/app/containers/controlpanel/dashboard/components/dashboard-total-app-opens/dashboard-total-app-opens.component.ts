import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-dashboard-total-app-opens',
  templateUrl: './dashboard-total-app-opens.component.html',
  styleUrls: ['./dashboard-total-app-opens.component.scss']
})
export class DashboardTotalAppOpensComponent implements OnInit {
  @Input() chartOptions;
  @Input() labels: string[] = [];
  @Input() series: number[] = [];

  constructor() {}

  ngOnInit() {}
}
