import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CPI18nService } from '../../../../../../../shared/services';

export interface IDateRange {
  end: number;
  start: number;
  label: string;
}

@Component({
  selector: 'cp-providers-action-box',
  templateUrl: './providers-action-box.component.html',
  styleUrls: ['./providers-action-box.component.scss']
})
export class ServicesProviderActionBoxComponent implements OnInit {
  @Input() noProviders;

  @Output() download: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<null> = new EventEmitter();
  @Output() filterByDates: EventEmitter<IDateRange> = new EventEmitter();
  @Output() launchAddProviderModal: EventEmitter<null> = new EventEmitter();

  constructor(public cpI18n: CPI18nService) {}

  onDownload() {
    this.download.emit();
  }

  onLaunchProviderAdd() {
    this.launchAddProviderModal.emit();
  }

  onSearch(query) {
    this.search.emit(query);
  }

  onDateChange(dateRange: IDateRange) {
    this.filterByDates.emit(dateRange);
  }

  ngOnInit() {}
}
