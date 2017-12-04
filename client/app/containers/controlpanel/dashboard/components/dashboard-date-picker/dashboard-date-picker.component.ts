import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DashboardUtilsService } from './../../dashboard.utils.service';

interface IDateChange {
  end: number,
  start: number,
  label: string,
}

@Component({
  selector: 'cp-dashboard-date-picker',
  templateUrl: './dashboard-date-picker.component.html',
  styleUrls: ['./dashboard-date-picker.component.scss']
})
export class DashboardDatePickerComponent implements OnInit {
  @Output() dateChange: EventEmitter<IDateChange> = new EventEmitter();

  selected = null;
  customDates = [];

  constructor(
    private helper: DashboardUtilsService
  ) { }

  handleCustomDate(date) {
    this.setLabel(date);
    this.triggerChange();
  }

  triggerChange() {
    this.dateChange.emit(this.selected);
  }

  setLabel(date) {
    this.selected = date;
  }

  ngOnInit() {
    this.customDates = [
      this.helper.last30Days(),
      this.helper.last90Days(),
      this.helper.lastYear(),
      this.helper.allTime()
    ]

    this.setLabel(this.customDates[0]);
  }
}
