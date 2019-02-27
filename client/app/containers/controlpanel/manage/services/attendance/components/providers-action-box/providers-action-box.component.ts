import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { EngagementService } from '@containers/controlpanel/assess/engagement/engagement.service';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';

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
  @Output() updateStudentFilter: EventEmitter<EngageUtils.IStudentFilter> = new EventEmitter();

  studentFilter$: Observable<any[]>;
  dateRanges: EngageUtils.IDateFilter[];

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public engageService: EngagementService,
    public engageUtils: EngageUtils.EngagementUtilsService
  ) {}

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

  onStudentFilter(filter: EngageUtils.IStudentFilter) {
    this.updateStudentFilter.emit(filter);
  }

  ngOnInit() {
    this.studentFilter$ = this.engageUtils.getStudentFilter();
    this.dateRanges = this.engageUtils.dateFilter();
  }
}
