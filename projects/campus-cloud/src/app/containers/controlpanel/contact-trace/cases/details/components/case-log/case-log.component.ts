import { Component, OnInit, Input } from '@angular/core';
import { ICaseLog, ICaseStatus } from '../../../cases.interface';
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
import { getCaseStatus } from '../../../store/reducers/status.reducer';
import { Observable } from 'rxjs';
import { environment } from '@projects/campus-cloud/src/environments/environment';

export interface ISourceActivityName {
  tag: string;
  name: string;
  source: string;
}

@Component({
  selector: 'cp-case-log',
  templateUrl: './case-log.component.html',
  styleUrls: ['./case-log.component.scss']
})
export class CaseLogComponent extends BaseComponent implements OnInit {
  sourceActivityName: ISourceActivityName[] = [
    { tag: '%creation%', name: 'Status Added', source: 'Manual Import' },
    { tag: '%manual_notes%', name: 'Notes Changes', source: 'Notes' },
    { tag: '%manual_status%', name: 'Status Change', source: 'Escalated by' }
  ];

  @Input() caseId: number;

  dateRanges: IDateFilter[];
  casesFilter: IItem[];
  caseLog: ICaseLog[];
  dateFormat = FORMAT.SHORT;
  loading: boolean = true;
  filterCasesStatus;
  caseStatus$: Observable<IItem[]>;
  noteSvgPath: string;

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
    private store: Store<fromStore.ICasesState>
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
    search = search.append('case_id', this.caseId.toString());
    super.fetchData(this.service.getCaseActivityLog(search)).then((res) => {
      this.loading = false;
      this.caseLog = res.data.map((item) => {
        const newItem = { ...item, event: '', source: '' };
        const matchedSource = this.sourceActivityName.filter((name) => {
          return name.tag === item.source_activity_name;
        })[0];

        if (matchedSource) {
          switch (matchedSource.tag) {
            case this.sourceActivityName[0].tag:
              newItem.event = `${matchedSource.name} - ${item.new_status.name}`;
              newItem.source = this.sourceActivityName[0].source;
              break;
            case this.sourceActivityName[1].tag:
              newItem.event = matchedSource.name;
              newItem.source = matchedSource.source;
              break;
            case this.sourceActivityName[2].tag:
              newItem.event = `${matchedSource.name} - ${item.new_status.name}`;
              newItem.source = `${matchedSource.source}`;
          }
        } else {
          newItem.event = item.source_activity_name;
        }

        return newItem;
      });
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

  launchNoteModal() {
    $('#viewNote').modal({ keyboard: true, focus: true });
  }

  ngOnInit() {
    this.noteSvgPath = `${environment.root}assets/svg/contact-trace/cases/external-link.svg`;
    this.getCasesStatus();
    this.loadCaseActivityLog();
  }
}
