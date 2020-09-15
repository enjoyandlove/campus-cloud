import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { map } from 'rxjs/operators';
import { CPSession } from '@campus-cloud/session';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import {
  IItem,
  IDateRange,
  CPSearchBoxComponent,
  CPRangePickerComponent
} from '@campus-cloud/shared/components';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives/tracking';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';
import { CasesUtilsService } from '../../../cases.utils.service';
import { ICaseStatus } from '../../../cases.interface';
import * as fromStore from '../../../store';
import { CPDate } from '@projects/campus-cloud/src/app/shared/utils';
import { getItem } from '@campus-cloud/shared/components/cp-dropdown/cp-dropdown.component';

@Component({
  selector: 'cp-cases-list-action-box',
  templateUrl: './list-action-box.component.html',
  styleUrls: ['./list-action-box.component.scss']
})
export class CasesListActionBoxComponent implements OnInit, OnDestroy {
  @Input() isDownloading;

  @Output() launchCreateCaseModal: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() selectedFilter: EventEmitter<number> = new EventEmitter();
  @Output() filterByDates: EventEmitter<IDateRange> = new EventEmitter();
  @Output() onDownload: EventEmitter<null> = new EventEmitter();

  @ViewChild('searchbox') searchBox: CPSearchBoxComponent;
  @ViewChild('datepicker') datePicker: CPRangePickerComponent;

  eventData;
  caseStatus$: Observable<IItem[]>;
  dateRanges: EngageUtils.IDateFilter[];
  resetActionbox$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  dateFilterOpts;
  selectedCaseStatus$: Observable<IItem>;

  private destroy$ = new Subject();

  constructor(
    public session: CPSession,
    public cpI18nPipe: CPI18nPipe,
    private cpTracking: CPTrackingService,
    public engageUtils: EngageUtils.EngagementUtilsService,
    public utils: CasesUtilsService,
    public store: Store<fromStore.State>
  ) {}

  getCaseStatus() {
    const caseStatusLabel = this.cpI18nPipe.transform('case_status_all');
    this.caseStatus$ = this.store.select(fromStore.getCaseStatus).pipe(
      map((caseStatus: ICaseStatus[]) => {
        const responseCopy = [...caseStatus];
        return this.utils.getCaseStatusOptions(
          responseCopy.sort((a, b) => b.rank - a.rank),
          caseStatusLabel
        );
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
    this.launchCreateCaseModal.emit(false);
  }

  onImportCSV() {
    $('#excelCasesModal').modal({ keyboard: true, focus: true });
  }

  onDownloadCases() {
    if (!this.isDownloading) {
      this.onDownload.emit();
    }
  }

  launchCreateModal() {
    $('#createCase').modal({ keyboard: true, focus: true });
  }

  onResetActionBox() {
    this.resetActionbox$.next(true);
    this.searchBox.onClear();
    const date = {
      start: null,
      end: null,
      label: ''
    };
    this.datePicker.setLabel(date);
    this.dateRanges = null;
  }

  ngOnInit() {
    this.getCaseStatus();

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getAmplitudeMenuProperties()
    };

    this.dateRanges = this.engageUtils.dateFilter();

    this.dateFilterOpts = {
      inline: true,
      mode: 'range',
      maxDate: CPDate.now(this.session.tz).format(),
      minDate: null
    };

    this.selectedCaseStatus$ = this.store.select(fromStore.getSelectedCaseStatus).pipe(
      map((caseStatus: ICaseStatus) => {
        const copyStatus = { ...caseStatus };
        return caseStatus ? getItem(copyStatus, 'name', 'id') : null;
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
