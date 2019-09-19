import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-dashboard-unique-active-users',
  templateUrl: './dashboard-unique-active-users.component.html',
  styleUrls: ['./dashboard-unique-active-users.component.scss']
})
export class DashboardUniqueActiveUsersComponent implements OnInit {
  @Input() chartOptions;
  @Input() labels: string[] = [];
  @Input() series: number[] = [];

  constructor() {}

  ngOnInit() {}
}
