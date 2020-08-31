import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  ICaseLog,
  ICaseStatus,
  ICase,
  SourceActivityType,
  SourceType
} from '../../../cases.interface';
import { CPI18nPipe, FORMAT } from '@campus-cloud/shared/pipes';
import { CPSession } from '@campus-cloud/session';
import { CasesService } from '../../../cases.service';
import { BaseComponent } from '@projects/campus-cloud/src/app/base';
import { HttpParams } from '@angular/common/http';
import * as fromStore from '../../../store';
import { IItem } from '@campus-cloud/shared/components';
import { CasesUtilsService } from '../../../cases.utils.service';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';
import { CPDate } from '@projects/campus-cloud/src/app/shared/utils';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-case-log',
  templateUrl: './case-log.component.html',
  styleUrls: ['./case-log.component.scss']
})
export class CaseLogComponent extends BaseComponent implements OnInit {
  @Input() case: ICase;
  @Input() isSubmitted: boolean;

  @Output() onLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  dateRanges: EngageUtils.IDateFilter[];
  casesFilter: IItem[];
  caseLog: ICaseLog[];
  dateFormat = FORMAT.SHORT;
  loading = true;
  eventModalLoading = true;
  filterCasesStatus;
  caseStatus$: Observable<IItem[]>;
  noteSvgPath: string;
  modalNote: string;
  isNoteModalOpened = false;
  sourceActivityName;
  eventCases: ICase[];
  eventData;
  isDownloading = false;

  public get sourceActivityType(): typeof SourceActivityType {
    return SourceActivityType;
  }
  public get sourceType(): typeof SourceType {
    return SourceType;
  }
  dateFilterOpts;

  state = {
    current_status_id: null,
    start: null,
    end: null
  };

  constructor(
    private session: CPSession,
    private service: CasesService,
    private cpI18nPipe: CPI18nPipe,
    private utils: CasesUtilsService,
    private engageUtils: EngageUtils.EngagementUtilsService,
    private store: Store<fromStore.State>,
    public cpTracking: CPTrackingService,
    private util: CasesUtilsService
  ) {
    super();
  }

  getCasesStatus() {
    const caseStatusLabel = this.cpI18nPipe.transform('case_status_all');
    this.caseStatus$ = this.store.select(fromStore.getCaseStatus).pipe(
      map((statuses: ICaseStatus[]) => {
        const responseCopy = [...statuses];
        return this.utils.getCaseStatusOptions(
          responseCopy.sort((a, b) => b.rank - a.rank),
          caseStatusLabel
        );
      })
    );
  }

  loadCaseActivityLog() {
    this.loading = true;

    let search = new HttpParams();
    search = this.session.addSchoolId(search);
    search = search
      .append('case_id', this.case.id.toString())
      .append('start', this.state.start)
      .append('end', this.state.end);

    if (this.state.current_status_id !== 0) {
      search = search.append('new_status_ids', this.state.current_status_id);
    }

    super
      .fetchData(this.service.getCaseActivityLog(this.startRange, this.endRange, search))
      .then((res) => {
        this.loading = false;
        this.onLoaded.emit(true);
        this.caseLog = this.utils.serializeCaseLog(res.data);
      });
  }

  downloadActivity() {
    this.isDownloading = true;

    let search = new HttpParams();

    search = this.session.addSchoolId(search);
    search = search
      .append('case_id', this.case.id.toString())
      .append('start', this.state.start)
      .append('end', this.state.end)
      .append('all', '1');

    if (this.state.current_status_id !== 0) {
      search = search.append('new_status_ids', this.state.current_status_id);
    }

    const stream$ = this.service.getCaseActivityLog(this.startRange, this.endRange, search);

    stream$.toPromise().then((caseLogs: any) => {
      if (!!caseLogs.length) {
        caseLogs = caseLogs.map((el) => ({
          firstname: this.case.firstname,
          lastname: this.case.lastname,
          extern_user_id: this.case.extern_user_id,
          student_id: this.case.student_id,
          ...el
        }));

        this.util.exportCaseActivities(this.utils.serializeCaseLog(caseLogs));
        this.isDownloading = false;
      }
    });
  }

  onDateChange(dateRange) {
    if (dateRange) {
      this.state = {
        ...this.state,
        start: dateRange.payload ? dateRange.payload.range.start : dateRange.start,
        end: dateRange.payload ? dateRange.payload.range.end : dateRange.end
      };

      this.loadCaseActivityLog();
    }
  }

  onLogFilter(item) {
    this.state = {
      ...this.state,
      current_status_id: item.action
    };
    this.loadCaseActivityLog();
  }

  launchNoteModal(new_notes) {
    this.modalNote = new_notes;
    $('#viewNote').modal({ keyboard: true, focus: true });
  }

  onUpdatedCase() {
    this.loadCaseActivityLog();
  }

  launchCaseEventModal(event_id) {
    this.eventModalLoading = true;

    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('contact_trace_event_id', event_id);

    super.fetchData(this.service.getCases(this.startRange, this.endRange, search)).then((res) => {
      this.eventCases = res.data;
      this.eventModalLoading = false;
    });

    $('#viewEvent').modal({ keyboard: true, focus: true });
  }

  ngOnInit() {
    this.sourceActivityName = this.utils.sourceActivityName;

    this.noteSvgPath = `${environment.root}assets/svg/contact-trace/cases/external-link.svg`;
    this.dateRanges = this.engageUtils.dateFilter();

    this.dateFilterOpts = {
      inline: true,
      mode: 'range',
      maxDate: CPDate.now(this.session.tz).format(),
      minDate: null
    };

    this.getCasesStatus();
    this.loadCaseActivityLog();

    const eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_name: amplitudeEvents.INFO
    };

    this.eventData = {
      eventProperties,
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM
    };
  }
}
