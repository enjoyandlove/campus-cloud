import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICaseLog, ICaseStatus, ICase, SourceActivityType } from '../../../cases.interface';
import { CPI18nPipe, FORMAT } from '@projects/campus-cloud/src/app/shared/pipes';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { CasesService } from '../../../cases.service';
import { BaseComponent } from '@projects/campus-cloud/src/app/base';
import { HttpParams } from '@angular/common/http';
import * as fromStore from '../../../store';
import { IItem } from '@projects/campus-cloud/src/app/shared/components';
import { CasesUtilsService } from '../../../cases.utils.service';
import { IDateFilter } from '@controlpanel/assess/engagement/engagement.utils.service';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@projects/campus-cloud/src/environments/environment';
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

  dateRanges: IDateFilter[];
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

  public get sourceActivityType(): typeof SourceActivityType {
    return SourceActivityType;
  }

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
    private store: Store<fromStore.State>,
    public cpTracking: CPTrackingService
  ) {
    super();
  }

  getCasesStatus() {
    const caseStatusLabel = this.cpI18nPipe.transform('case_status_all');
    this.caseStatus$ = this.store.select(fromStore.getCaseStatus).pipe(
      map((statuses: ICaseStatus[]) => {
        const responseCopy = [...statuses];
        return this.utils.getCaseStatusOptions(responseCopy, caseStatusLabel);
      })
    );
  }

  loadCaseActivityLog() {
    this.loading = true;

    let search = new HttpParams();
    search = this.session.addSchoolId(search);
    search = search.append('case_id', this.case.id.toString());

    super.fetchData(this.service.getCaseActivityLog(search)).then((res) => {
      this.loading = false;
      this.onLoaded.emit(true);
      this.caseLog = this.utils.serializeCaseLog(res.data);
    });
  }

  onDateChange(dateRange) {
    if (dateRange.payload) {
      dateRange = {
        label: dateRange.label,
        start: dateRange.payload.range.start,
        end: dateRange.payload.range.end
      };

      this.state = {
        ...this.state,
        start: dateRange.start,
        end: dateRange.end
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

  onUpdatedCase(updated) {
    this.loadCaseActivityLog();
  }

  onLogLoaded(event) {}

  ngOnInit() {
    this.sourceActivityName = this.utils.sourceActivityName;

    this.noteSvgPath = `${environment.root}assets/svg/contact-trace/cases/external-link.svg`;
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
