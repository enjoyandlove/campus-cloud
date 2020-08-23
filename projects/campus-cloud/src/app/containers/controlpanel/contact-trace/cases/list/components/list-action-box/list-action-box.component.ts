import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { CPSession } from '@campus-cloud/session';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { IItem, IDateRange } from '@campus-cloud/shared/components';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives/tracking';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';
import { CasesUtilsService } from '../../../cases.utils.service';
import { ICaseStatus } from '../../../cases.interface';
import * as fromStore from '../../../store';

@Component({
  selector: 'cp-cases-list-action-box',
  templateUrl: './list-action-box.component.html',
  styleUrls: ['./list-action-box.component.scss']
})
export class CasesListActionBoxComponent implements OnInit {
  @Output() launchCreateCaseModal: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() selectedFilter: EventEmitter<number> = new EventEmitter();
  @Output() filterByDates: EventEmitter<IDateRange> = new EventEmitter();
  eventData;
  caseStatus$: Observable<IItem[]>;
  dateRanges: EngageUtils.IDateFilter[];

  private destroy$ = new Subject();

  constructor(
    public session: CPSession,
    public cpI18nPipe: CPI18nPipe,
    private cpTracking: CPTrackingService,
    public engageUtils: EngageUtils.EngagementUtilsService,
    public utils: CasesUtilsService,
    public store: Store<fromStore.ICasesState>
  ) {}

  getCaseStatus() {
    const caseStatusLabel = this.cpI18nPipe.transform('case_status_all');
    this.caseStatus$ = this.store.select(fromStore.getCaseStatus).pipe(
      map((caseStatus: ICaseStatus[]) => {
        const responseCopy = [...caseStatus];
        return this.utils.getCaseStatusOptions(responseCopy, caseStatusLabel);
      })
    );
  }

  onSearch(query) {
    this.search.emit(query);
  }

  onCasesFilter(filter) {
    this.selectedFilter.emit(filter.action);
  }

  onDateChange(dateRange) {
    if (dateRange.payload) {
      dateRange = {
        label: dateRange.label,
        start: dateRange.payload.range.start,
        end: dateRange.payload.range.end
      };
    }

    this.filterByDates.emit(dateRange);
  }

  onCreateCases() {
    this.launchCreateModal();
    this.launchCreateCaseModal.emit();
  }

  onImportCSV() {}

  onDownloadCases() {}

  launchCreateModal() {
    $('#createCase').modal({ keyboard: true, focus: true });
  }

  ngOnInit() {
    this.getCaseStatus();

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getAmplitudeMenuProperties()
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
