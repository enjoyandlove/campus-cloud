import { Component, OnInit } from '@angular/core';

import { DashboardUtilsService } from './../../dashboard.utils.service';

@Component({
  selector: 'cp-dashboard-date-picker',
  templateUrl: './dashboard-date-picker.component.html',
  styleUrls: ['./dashboard-date-picker.component.scss']
})
export class DashboardDatePickerComponent implements OnInit {
  constructor(
    private helper: DashboardUtilsService
  ) { }

  ngOnInit() {
    console.log(this.helper.last30Days());
    console.log(this.helper.last90Days());
    console.log(this.helper.lastYear());
    console.log(this.helper.allTime());
  }
}
